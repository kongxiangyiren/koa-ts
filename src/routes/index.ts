import koaRouter from 'koa-router';
const router = new koaRouter();

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  });
});

export default router;
