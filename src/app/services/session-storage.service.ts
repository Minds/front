export class SessionsStorageService {
  static _() {
    return new SessionsStorageService();
  }

  get(key: string) {
    return window.sessionStorage.getItem(key);
  }
  set(key: string, value: any) {
    return window.sessionStorage.setItem(key, value);
  }
  destroy(key: string) {
    return window.sessionStorage.removeItem(key);
  }
}
