import ApiResource from '../user/tables/ApiResource';

export class MemoryStorageService {
  private apiResources: Map<string, ApiResource> = new Map();
  private feedOffsets: Map<string, number> = new Map();

  getFeedOffset(feedUrl: string, routeUrl: string) {
    return this.feedOffsets.get(feedUrl + routeUrl);
  }

  setFeedOffset(feedUrl: string, routeUrl: string, offset: number) {
    return this.feedOffsets.set(feedUrl + routeUrl, offset);
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
