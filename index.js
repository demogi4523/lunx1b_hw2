import Application from "./src/Application.js";
import Router from "./src/Router.js";


const app = new Application();
const router = new Router();
router.addPath('/', ['GET'], (params) => {
  const ans = [];
  for (const [key, value] of params.entries()) {
    ans.push(`Key: ${key}, Value: ${value}`);
  }
  ans.push('OK')
  return ans.join('\n');
});

app.addRouter(router);
app.listen();
