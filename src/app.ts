import Koa from 'koa';
import views from 'koa-views';
import onerror from 'koa-onerror';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Static from 'koa-static';
import config from './config/config';

import router from './config/route';
import routerV from './config/route.vercel';
import log4js from './plugins/log4js';

const isDev = __filename.substring(__filename.lastIndexOf('.') + 1) === 'ts';

async function run() {
  const app = new Koa();

  // error handler
  onerror(app);

  app.use(
    bodyParser({
      enableTypes: ['json', 'form', 'text']
    })
  );

  app.use(
    logger((str, args) => {
      log4js.logInfo(str);
    })
  );

  // 静态文件
  app.use(Static(process.cwd() + '/www'));

  // logger
  app.use(async (ctx, next) => {
    const start = +new Date();
    await next();
    const ms = +new Date() - start;
    log4js.logInfo(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });

  // 模板
  app.use(
    views(process.cwd() + '/views', {
      map: { html: 'nunjucks' },
      extension: 'html'
    })
  );

  // 加载路由
  if (config.verel && !isDev) {
    routerV(app);
  } else {
    await router(app);
  }

  // 设置404
  app.use(async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
      ctx.status = 404;
      await ctx.render('404');
    }
  });

  // error-handling
  app.on('error', (err, ctx) => {
    log4js.logError(err);
  });
  app.on('error-info', (err, ctx) => {
    log4js.logInfo(err);
  });
  app.listen(config.port, () => {
    log4js.logInfo('http://127.0.0.1:' + config.port);
  });
}

run();
