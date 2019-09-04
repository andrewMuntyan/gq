const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  // items(parent, args, ctx, info) {
  //   const items = ctx.db.query.items();
  //   return items;
  // },
};

module.exports = Query;
