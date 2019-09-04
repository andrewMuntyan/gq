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
};

module.exports = Mutations;
