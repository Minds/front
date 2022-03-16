import ApiResource from '../user/tables/ApiResource';

export class MemoryStorageService {
  private apiResources: Map<string, ApiResource> = new Map();

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
