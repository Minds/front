export class MemoryStorageService {
  private apiResources: Map<string, any> = new Map();
  private feedState: Map<string, any> = new Map();
  private activityOutletRatios: Map<string, any> = new Map();
  private wrapGroupDimensions;

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

  public getFeedItemRatio(id: string): object | null {
    return this.activityOutletRatios.get(id)?.ratio;
  }

  /**
   * @param id - the identifier of the feed item
   * @param ratio - the height / width ratio
   */
  public async setFeedItemRatio(id: string, ratio: number) {
    this.activityOutletRatios.set(id, {
      id,
      ratio,
      persistedAt: Date.now(),
    });
  }

  getWrapGroupDimensions() {
    return this.wrapGroupDimensions;
  }

  setWrapGroupDimensions(data: any): void {
    this.wrapGroupDimensions = data;
  }
}
