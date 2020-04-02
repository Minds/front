import Dexie from 'dexie';

import DexieStorageAdapter from '../lib/minds-sync/adapters/DexieStorageAdapter';
import InMemoryStorageAdapter from '../lib/minds-sync/adapters/InMemoryStorageAdapter';

export const isDexieSupported = new Promise(async resolve => {
  if (!window.indexedDB) {
    resolve(false);
    return;
  }

  const tmpDbName = '_minds_idb_support_test_2';

  try {
    Dexie.delete(tmpDbName);
  } catch (e) {
    /* noop */
  }

  try {
    indexedDB.deleteDatabase(tmpDbName);
  } catch (e) {
    /* noop */
  }

  try {
    const testDB = new Dexie(tmpDbName);
    testDB.version(1).stores({
      test: 'id',
    });

    await testDB.open();

    await testDB.table('test').put({
      id: Date.now(),
    });

    resolve(true);
  } catch (e) {
    console.warn('IndexedDB/Dexie support check exception', e);
    resolve(false);
  }
});

export default async function browserStorageAdapterFactory(
  name: string
): Promise<DexieStorageAdapter | InMemoryStorageAdapter> {
  if (await isDexieSupported) {
    console.info(`IndexedDB is supported for ${name}`);
    return new DexieStorageAdapter(new Dexie(name));
  } else {
    console.warn(
      `IndexedDB is NOT supported for ${name}. Using in-memory fallback.`
    );

    if (!window._inMemoryStorageAdapterDb) {
      window._inMemoryStorageAdapterDb = {};
    }

    window._inMemoryStorageAdapterDb[name] = {};

    return new InMemoryStorageAdapter(window._inMemoryStorageAdapterDb[name]);
  }
}
