import * as React from "react";
import type { BrowserHistory } from "history";
import { HistoryContext } from "../HistoryContext";

function loadPackage(history: BrowserHistory, packageName: string) {
  return function (e: any) {
    e.preventDefault();
    history.push(`/package/${packageName}`);
  };
}

export function Search({
  results,
  searchTerm,
}: {
  searchTerm: string;
  results: Array<{
    package: {
      name: string;
      version: string;
      description: string;
      publisher: {
        username: string;
      };
    };
  }>;
}) {
  return (
    <section className="md:w-2/3 m-auto p-8 mt-16">
      <h1 className="text-center">
        {" "}
        {results.length} results found for{" "}
        <span className="mg-search-term">"{searchTerm}"</span>{" "}
      </h1>
      {/* @ts-ignore */}
      {results.map(({ package: pkg }, i: number) => (
        <section key={i} className="mt-2 p-4 border rounded border-gray">
          <h2>
            <HistoryContext.Consumer>
              {(history) => (
                <a
                  onClick={loadPackage(history, pkg.name)}
                  href={"/package/" + encodeURIComponent(pkg.name)}
                >
                  {pkg.name}
                </a>
              )}
            </HistoryContext.Consumer>
          </h2>
          <p>v{pkg.version}</p>
          <p>
            {" "}
            <span className="text-gray-400">By</span> {pkg.publisher.username}{" "}
          </p>
          <p>{pkg.description}</p>
        </section>
      ))}
    </section>
  );
}
