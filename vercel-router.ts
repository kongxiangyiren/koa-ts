import glob from 'glob';
import { join } from 'path';
import fs from 'fs';

function getRouter() {
  const routes = glob.sync(join(__dirname, './src/routes/**/*.ts'), {
    windowsPathsNoEscape: true
  });
  console.log(routes);
  let routeImport: string = '';
  let appUse: string = '';
  routes.forEach((item, index) => {
    let route = item.replace(item.substring(0, item.lastIndexOf('/src/routes')+11) , '../routes');
    routeImport += `import ${'router' + index} from '${route.substring(0, route.length - 3)}';\n`;
    appUse += `app.use(${'router' + index}.routes())\n`;
  });
  const data = `
  import { type DefaultState, type DefaultContext } from 'koa';
  ${routeImport}

  export default async function router(app: import('koa')<DefaultState, DefaultContext>) {
 ${appUse}
    
  }
  
  `;
  fs.mkdirSync(join(__dirname, './src/config'), { recursive: true });
  fs.writeFileSync(join(__dirname, './src/config/route.vercel.ts'), data);
}

getRouter();
