import ReactDOMServer from "react-dom/server";
// @ts-ignore
import { resolve } from "./Routes";

// @ts-ignore
export function resolve(pathname: string) {
  return resolve(pathname).then((SelectedReactNode: any) =>
    ReactDOMServer.renderToString(SelectedReactNode)
  );
}
