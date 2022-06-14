import ReactDOMServer from 'react-dom/server';

// @ts-ignore
import { init as initRouter, resolve as resolveRoute } from './Routes';

// @ts-ignore
export function init(addr: any): any {
  return initRouter(addr);
}

// @ts-ignore
export function resolve(ssrHandle: any, pathname: string) {
  return resolveRoute(ssrHandle, pathname).then((SelectedReactNode: any) =>
    ReactDOMServer.renderToString(SelectedReactNode)
  );
}
