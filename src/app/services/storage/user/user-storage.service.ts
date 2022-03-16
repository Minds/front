import { MindsUser } from './../../../interfaces/entities';
import UserDB from './user.db';

export class UserStorageService {
  private db: UserDB;

  constructor(user: MindsUser) {
    this.db = new UserDB(user.guid);
  }

  public getApiResource(url: string) {
    return this.db.apiResources
      .where('url')
      .equals(url)
      .first();
  }

  public async setApiResource(url: string, data: any) {
    this.db.apiResources.put({
      url,
      data,
      persistedAt: Date.now(),
    });
  }
}
