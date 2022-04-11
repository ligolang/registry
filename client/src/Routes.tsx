import UniversalRouter from "universal-router";
import { search } from "./handlers";
import { FirstFold } from "./reactjs/FirstFold";
import { Search } from "./reactjs/Search";
import { Package } from "./reactjs/Package";
import nodeFetch from "node-fetch";
import url from "url";

let fetch =
  typeof window === "undefined"
    ? (path: string) => nodeFetch(`http://localhost:4000${path}`)
    : window.fetch;

let routes = [
  {
    path: "",
    action: () => <FirstFold search={search} />,
  },
  {
    path: "/search/:packageName",
    action: (context: any) => {
      let {
        params: { packageName },
      } = context;
      return fetch(`/api/search?packageName=${packageName}`)
        .then((r) => r.json())
        .then((packages) => {
          return <Search searchTerm={packageName} results={packages} />;
        });
    },
  },
  {
    path: "/package",
    children: [
      {
        path: "",
        action: () => {
          throw new Error("TODO: redirect isomorphically to /:pacakgeName");
        },
      },
      {
        path: "/:packageName",
        action: (context: any) => {
          let {
            params: { packageName },
          } = context;
          return fetch(`/api/readme?packageName=${packageName}`)
            .then((r) => r.json())
            .then(({ data }) => <Package article={data} />);
        },
      },
    ],
  },
];

let router = new UniversalRouter(routes);

export function resolve(path: any): Promise<any> {
  return router.resolve(path);
}
