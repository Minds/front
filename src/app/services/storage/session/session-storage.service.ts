export class SessionStorageService {
  private db: Storage = window.sessionStorage;

  public getApiResource(url: string) {
    try {
      return JSON.parse(this.db.getItem(`apiResource:${url}`));
    } catch (e) {
      console.log(e);
    }
  }

  public async setApiResource(url: string, data: any) {
    this.db.setItem(
      `apiResource:${url}`,
      JSON.stringify({
        url,
        data,
        persistedAt: Date.now(),
      })
    );
  }
}
