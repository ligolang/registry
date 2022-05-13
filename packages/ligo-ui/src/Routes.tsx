import nodeFetch from 'node-fetch';
import * as React from 'react';
import UniversalRouter from 'universal-router';

import { Featured } from './reactjs/Featured';
import { Home } from './reactjs/Home';
import { Package } from './reactjs/Package';
import { Packages } from './reactjs/Packages';
import { Search } from './reactjs/Search';

let fetch =
  typeof window === 'undefined'
    ? (path: string) => nodeFetch(`http://localhost:4000${path}`)
    : window.fetch;

let routes = [
  {
    path: '',
    action: () => <Home />,
  },
  {
    path: '/search/:query',
    action: (context: any) => {
      let {
        params: { query },
      } = context;
      return fetch(`/-/ui/search/${query}`).then((r) => {
        if (r.status === 200) {
          return r.json().then((packages) => {
            return <Search searchTerm={query} results={packages} />;
          });
        } else if (r.status === 404) {
          return <Search searchTerm={query} results={[]} />;
        } else {
          // TODO(prometheansacrifice) Error handling and communication
          return <Search searchTerm={query} results={[]} />;
        }
      });
    },
  },
  {
    path: '/featured',
    children: [
      {
        path: '',
        action: () => {
          // Mocking fetch for client side testing
          /* eslint-disable @typescript-eslint/no-unused-vars */
          /* @ts-ignore */
          /* let originalFetch = window.fetch;
           * /* eslint-disable no-console
           * let d = (x: any) => {
           *   console.log(x);
           *   return x;
           * };
           * let fetch = (_options: any, _data?: any) => {
           *   let packages = ['registry-url'];
           *   return Promise.all(
           *     packages.map((pkg) => {
           *       return originalFetch(`/-/verdaccio/data/sidebar/${pkg}`).then((r) => r.json());
           *     })
           *   )
           *     .then(d)
           *     .then((packages) =>
           *       Promise.resolve(
           *         new Response(
           *           JSON.stringify({
           *             packages,
           *           })
           *         )
           *       )
           *     );
           * };
           */
          return fetch(`/-/ui/featured`)
            .then((r) => r.json())
            .then((packages) => (
              <Featured
                packages={packages
                  .filter((p: any) => !!p['dist-tags'])
                  .map((p: any) => {
                    return p.versions[p['dist-tags'].latest];
                  })
                  .sort()}
              />
            ));
        },
      },
    ],
  },
  {
    path: '/packages',
    children: [
      {
        path: '',
        action: () => {
          return fetch('/-/ui/packages/')
            .then((r) => r.json())
            .then((packages) => <Packages packages={packages} />);
        },
      },
    ],
  },
  {
    path: '/package',
    children: [
      {
        path: '',
        action: () => {
          throw new Error('TODO: redirect isomorphically to /:packageName');
        },
      },
      {
        path: '/:packageName',
        action: (context: any) => {
          let {
            params: { packageName },
          } = context;
          // Mocking fetch for client side testing
          /* eslint-disable @typescript-eslint/no-unused-vars */
          /* @ts-ignore */
          /* let fetch = (_options, _data?) => {
           *   return Promise.resolve(
           *     new Response(
           *       JSON.stringify({
           *         description: 'Get the set npm registry URL',
           *         author: 'Jane Doe',
           *         website: 'http://www.foobar.com',
           *         repository: 'https://github.com/ligo-leftpad',
           *         lastWeekDownloads: 1432,
           *         markdown: `
             # registry-url


             It's usually, but it's [configurable](https://docs.npmjs.com/misc/registry).

             Use this if you do anything with the npm registry as users will expect it to use their configured registry.

             ## Install

             \`\`\`
             $ npm install registry-url
             \`\`\`

             ## Usage

             \`\`\`ini
             # .npmrc
             registry = 'https://custom-registry.com/'
             \`\`\`

             \`\`\`js
             import registryUrl from 'registry-url';

             console.log(registryUrl());
             //=> 'https://custom-registry.com/'
             \`\`\`

             It can also retrieve the registry URL associated with an [npm scope](https://docs.npmjs.com/misc/scope).

             \`\`\`ini
             # .npmrc
             @myco:registry = 'https://custom-registry.com/'
             \`\`\`

             \`\`\`js
             import registryUrl from 'registry-url';

             console.log(registryUrl('@myco'));
             //=> 'https://custom-registry.com/'
             \`\`\`

             If the provided scope is not in the user's \`.npmrc\` file, then \`registry-url\` will check for the existence of \`registry\`, or if that's not set, fallback to the default npm registry.

           *   `,
           *       })
           *     )
           *   );
           * }; */
          return fetch(`/-/api/${packageName}`)
            .then(
              (r) => r.json()
              /* r.text().then((responseText) => {
               *   try {
               *     return JSON.parse(responseText);
               *   } catch (e) {
               *     if (e instanceof SyntaxError) {
               *       return { data: '## No readme found' };
               *     } else {
               *       return Promise.reject(e);
               *     }
               *   }
               * }) */
            )
            .then((data) => {
              let { readme, lastWeekDownloads } = data;
              let {
                author = {},
                description,
                repository = '',
                homepage: website,
              } = data.versions[data['dist-tags'].latest];
              return fetch(`/-/ui/readme/${packageName}`)
                .then((r) => r.json())
                .then(({ data: readme }) => {
                  let repositoryUrl =
                    (repository.url &&
                      repository.url.replace(/^git\+/, '').replace(/\.git$/, '')) ||
                    null;
                  return (
                    <Package
                      name={packageName}
                      markdown={readme}
                      description={description}
                      author={author.name}
                      website={website}
                      repository={repositoryUrl}
                      lastWeekDownloads={lastWeekDownloads}
                    />
                  );
                });
            })
            .catch((e) => {
              // eslint-disable-next-line no-console
              console.log(e);
              return <p> TODO: error handling </p>;
            });
        },
      },
    ],
  },
];

let router = new UniversalRouter(routes);

export function resolve(path: any): Promise<any> {
  return router.resolve(path);
}
