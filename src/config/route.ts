import { type DefaultState, type DefaultContext } from 'koa';
import glob from 'glob';
import { join } from 'path';
// import index from '../routes/index';

export default async function router(app: import('koa')<DefaultState, DefaultContext>) {
  // 自动导入路由
  const routes = glob.sync(join(__dirname, '../routes/**/*.{js,ts}'), {
    windowsPathsNoEscape: true
  });

  return await new Promise((resolve, reject) => {
    try {
      routes.forEach(async item => {
        const router = await import(item);

        if (Object.keys(router.default).length !== 0) {
          app.use(router.default.routes());
        }
      });
      resolve('路由加载:' + routes);
    } catch (error) {
      reject(error);
    }
  });
}
