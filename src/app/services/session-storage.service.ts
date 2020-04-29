export class SessionsStorageService {
  static _() {
    return new SessionsStorageService();
  }

  get(key: string) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }
  set(key: string, value: any) {
    return window.sessionStorage.setItem(key, value);
  }
  destroy(key: string) {
    return window.sessionStorage.removeItem(key);
  }
}
