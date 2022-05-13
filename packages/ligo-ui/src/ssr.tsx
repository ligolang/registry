import ReactDOMServer from 'react-dom/server';

// @ts-ignore
import { resolve as resolveRoute } from './Routes';

// @ts-ignore
export function resolve(pathname: string) {
  return resolveRoute(pathname).then((SelectedReactNode: any) =>
    ReactDOMServer.renderToString(SelectedReactNode)
  );
}
