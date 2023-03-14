import { type DefaultState, type DefaultContext } from 'koa';
import router0 from '../routes/api/index';
import router1 from '../routes/index';

export default async function router(app: import('koa')<DefaultState, DefaultContext>) {
  app.use(router0.routes());
  app.use(router1.routes());
}
