import Dexie, { Table } from 'dexie';
import ApiResource from './tables/ApiResource';

export default class UserDB extends Dexie {
  apiResources!: Table<ApiResource, number>;

  constructor(guid: string) {
    super(`userdb_${guid}`);
    this.version(3).stores({
      apiResources: 'url',
    });
    this.apiResources.mapToClass(ApiResource);
  }
}
