/**
 * @author emi
 */
export let storageMock = new function () {
  let _storage: any = {};

  this.get = (key: string) => _storage[key] || null;

  this.set = (key: string, value: any) => {
    _storage[key] = value;
    return this;
  };

  this.destroy = (key: string) => this.set(key, null);
};
