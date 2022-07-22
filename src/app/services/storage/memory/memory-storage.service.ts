import ApiResource from '../user/tables/ApiResource';

export class MemoryStorageService {
  private apiResources: Map<string, ApiResource> = new Map();
  private feedOffsets: Map<string, number> = new Map();
  private feedState: Map<string, any> = new Map();

  getFeedOffset(feedUrl: string, routeUrl: string) {
    return this.feedOffsets.get(feedUrl + routeUrl);
  }

  setFeedOffset(feedUrl: string, routeUrl: string, offset: number) {
    return this.feedOffsets.set(feedUrl + routeUrl, offset);
  }

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
}
