export class Storage {
  static _() {
    return new Storage();
  }

  get(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      // We are catching here as some browser block localstorege.
      // TODO: Extend to .set and .destroy once this is verified as fix
      console.log(err);
      return null;
    }
  }
  set(key: string, value: any) {
    return window.localStorage.setItem(key, value);
  }
  destroy(key: string) {
    return window.localStorage.removeItem(key);
  }

  clear() {
    window.localStorage.clear();
  }
}
