import * as React from "react";
import validateNpmPackageName from "validate-npm-package-name";
import { HistoryContext } from "../HistoryContext";
import type { BrowserHistory } from "history";

function nullCheck(formDataValue: null | string | File): string {
  if (formDataValue instanceof File) {
    throw new Error("TODO: got file");
  } else if (formDataValue === undefined) {
    throw new Error("TODO: Got undefined");
  } else if (formDataValue === null) {
    throw new Error("TODO: Got null");
  } else if (formDataValue === "") {
    throw new Error("TODO: Empty string");
  } else {
    return formDataValue;
  }
}

type props = { search(e: any): Promise<void> };
export function FirstFold({ search }: props) {
  function handleSubmit(history: BrowserHistory) {
    return function (e: any) {
      e.preventDefault();
      let form = e.target;
      let data = new FormData(form);
      let inputPackageName = data.get("query");
      try {
        let nullCheckedPackageName = nullCheck(inputPackageName);
        let { validForNewPackages, warnings } = validateNpmPackageName(
          nullCheckedPackageName
        );
        if (validForNewPackages) {
          history.push(`/search/${nullCheckedPackageName}`, null);
        } else {
          return Promise.reject(warnings);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  return (
    <section className="w-full p-6 mt-12 md:w-2/3 lg:w-1/2 m-auto lg:flex-1 lg:flex flex-col items-center justify-center">
      <img
        className="w-32 block ml-auto mr-auto"
        src="/logo.svg"
        alt="Ligo Logo"
      />
      <h1 className="mt-6 text-center leading-tight">Ligo package registry</h1>
      <p className="mt-6 leading-normal text-center text-3xl">
        Get started with thousands of community powered packages
      </p>
      <HistoryContext.Consumer>
        {(history) => (
          <form
            onSubmit={handleSubmit(history)}
            className="mt-10 w-full relative"
          >
            <input
              autoFocus
              name="query"
              className="w-full absolute top-0 left-0 h-16 block rounded-full p-4 pl-6"
              placeholder="Search a package..."
            />
            <button
              type="submit"
              className="h-16 w-16 mr-6 absolute top-0 right-0 rounded-full w-6 h-6"
            >
              <img
                className="absolute top-0 right-0 w-8 h-16 block"
                src="./icons/search.svg"
                alt="search"
              />
            </button>
          </form>
        )}
      </HistoryContext.Consumer>
    </section>
  );
}
