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

  public getActivityDisplayOptions(guid: string): object | null {
    try {
      return JSON.parse(this.db.getItem(`activity:displayOptions:${guid}`))
        ?.data;
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  public async setActivityDisplayOptions(guid: string, data: any) {
    this.db.setItem(
      `activity:displayOptions:${guid}`,
      JSON.stringify({
        data: {
          showOnlyCommentsInput: data.showOnlyCommentsInput,
          showOnlyCommentsToggle: data.showOnlyCommentsToggle,
          expandedText: data.expandedText,
          expandedReplies: data.expandedReplies,
        },
        persistedAt: Date.now(),
      })
    );
  }
}
