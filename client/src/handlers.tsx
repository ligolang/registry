import validateNpmPackageName from "validate-npm-package-name";

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

export function search(e: any) {
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
      return fetch(`/api/search?packageName=${nullCheckedPackageName}`)
        .then((r) => r.json())
        .then(console.log);
    } else {
      return Promise.reject(warnings);
    }
  } catch (e) {
    return Promise.reject(e);
  }
}
