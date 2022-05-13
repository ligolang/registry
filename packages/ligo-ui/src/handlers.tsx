import type { BrowserHistory } from 'history';

function nullCheck(formDataValue: null | string | File): string {
  if (formDataValue instanceof File) {
    throw new Error('TODO: got file');
  } else if (formDataValue === undefined) {
    throw new Error('TODO: Got undefined');
  } else if (formDataValue === null) {
    throw new Error('TODO: Got null');
  } else if (formDataValue === '') {
    throw new Error('TODO: Empty string');
  } else {
    return formDataValue;
  }
}

export function handleSubmit(history: BrowserHistory) {
  return function (e: any) {
    e.preventDefault();
    let form = e.target;
    let data = new FormData(form);
    let query = data.get('query');
    try {
      let nullCheckedPackageName = nullCheck(query);
      history.push(`/search/${nullCheckedPackageName}`, null);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
