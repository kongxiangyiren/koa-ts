import koaRouter from 'koa-router';
const router = new koaRouter();
router.prefix('/api');
router.get('/', async (ctx, next) => {
  ctx.body = {
    s: 1
  };
});

export default router;
