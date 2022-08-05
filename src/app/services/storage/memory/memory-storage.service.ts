export class MemoryStorageService {
  private apiResources: Map<string, any> = new Map();
  private feedState: Map<string, any> = new Map();
  private activityDisplayOptions: Map<string, any> = new Map();

  getFeedState(feedUrl: string, routeUrl: string): any {
    return this.feedState.get(feedUrl + routeUrl);
  }

  setFeedState(feedUrl: string, routeUrl: string, data: any) {
    return this.feedState.set(feedUrl + routeUrl, data);
  }

  public getApiResource(url: string) {
    return this.apiResources.get(url);
  }

  public async setApiResource(url: string, data: any) {
    this.apiResources.set(url, {
      url,
      data,
      persistedAt: Date.now(),
    });
  }

  public getActivityDisplayOptions(guid: string): object | null {
    return this.activityDisplayOptions.get(guid)?.data;
  }

  public async setActivityDisplayOptions(guid: string, data: any) {
    this.activityDisplayOptions.set(guid, {
      guid,
      data: {
        showOnlyCommentsInput: data.showOnlyCommentsInput,
        showOnlyCommentsToggle: data.showOnlyCommentsToggle,
        expandedText: data.expandedText,
        expandedReplies: data.expandedReplies,
      },
      persistedAt: Date.now(),
    });
  }
}
