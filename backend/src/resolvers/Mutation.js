const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { transport, makeANiceEmail } = require('../mail');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: { ...args },
      },
      info,
    );

    return item;
  },
  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info,
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, '{ id, title }');

    // 2. Check if they own that item, or have the permissions
    // TODO
    // 3. Delete it
    if (item !== null) {
      return ctx.db.mutation.deleteItem({ where }, info);
    }
    return Promise.reject(new Error("can't find item"));
  },
  async signup(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    // hash passwoed
    const password = await bcrypt.hash(args.password, 10);
    // create the user in db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          email,
          permissions: { set: ['USER'] },
        },
      },
      info,
    );
    // create JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    return user;
  },
  // eslint-disable-next-line no-unused-vars
  async signin(parent, args, ctx, info) {
    const { email, password } = args;
    // 1. check if there is a user witj that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such User found for email ${email}`);
    }
    // 2. check if theyr password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    // 3. generate the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    // 5. return user
    return user;
  },
  // eslint-disable-next-line no-unused-vars
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodby!' };
  },
  // eslint-disable-next-line no-unused-vars
  async requestReset(parent, args, ctx, info) {
    const { email } = args;
    // 1. check if this is the real user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such User found for email ${email}`);
    }
    // 2. Set a reset Token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    // eslint-disable-next-line no-unused-vars
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });
    // 3. Email them that reset token
    const resetUrl = `${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}`;
    // eslint-disable-next-line no-unused-vars
    const mailResponse = await transport.sendMail({
      from: 'test@gq.com',
      to: user.email,
      subject: 'Your password reset Token',
      html: makeANiceEmail(
        `Your password reset token is here! \n\n <a href="${resetUrl}">Click Here to the Reset</a>`,
      ),
    });

    return { message: 'Email is sent!' };
  },
  // eslint-disable-next-line no-unused-vars
  async resetPassword(parent, args, ctx, info) {
    const { password, confirmPassword, resetToken } = args;
    // 1. check if the passwords match
    if (password !== confirmPassword) {
      throw new Error('Your passwords do not match!');
    }
    // 2. check if its a legit reset token
    // 3. check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }
    // 4. hash their new password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const { email } = user;
    // 5. save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email },
      data: {
        password: encryptedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 6. generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    // 8. return the new user
    return updatedUser;
  },
};

module.exports = Mutations;
