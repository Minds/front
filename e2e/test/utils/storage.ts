/**
 * Allows for the storage of variables between steps by key.
 * Instantiate as a singleton like so:
 * const storage: Storage = Storage.getInstance();
 */
export class Storage {
  // instance.
  private static _instance: Storage;

  // array of stored items.
  private storage: any[] = [];

  // cannot be constructed externally.
  private constructor() {}

  /**
   * Get shared instance.
   * @returns { Storage } shared instance.
   */
  static getInstance(): Storage {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new Storage();
    return this._instance;
  }

  /**
   * Add to storage
   * @param { string } key - key to store under.
   * @param { any } value - item to store.
   */
  public add(key: string, value: any): void {
    this.storage[key] = value;
  }

  /**
   * Get from storage.
   * @param { string } key - key to get item from storage.
   * @returns { any } item in storage or null if not found.
   */
  public get(key: string): any {
    return this.storage[key] ?? null;
  }
}
