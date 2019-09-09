const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // check if there is the current user id
    const {
      request: { userId },
      db,
    } = ctx;

    if (!userId) {
      return null;
    }
    return db.query.user(
      {
        where: { id: userId },
      },
      info,
    );
  },
  async users(parent, args, ctx, info) {
    // 1. check if they are logged in
    const {
      request: { userId, user },
      db,
    } = ctx;
    if (!userId) {
      throw new Error('You must be logged in to do that');
    }
    // 2. Check if the user has the permissions to query all users
    // throw error if they don't
    hasPermission(user, ['ADMIN']);
    // 3. if they do, querry all the users
    return db.query.users({}, info);
  },
};

module.exports = Query;
