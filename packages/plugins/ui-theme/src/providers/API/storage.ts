import memoryStorage from 'localstorage-memory';

let storage: Storage;
try {
  localStorage.setItem('__TEST__', '');
  localStorage.removeItem('__TEST__');
  storage = localStorage;
} catch (err: any) {
  storage = memoryStorage;
}

export default storage;
