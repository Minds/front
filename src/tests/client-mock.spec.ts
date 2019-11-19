/**
 * Created by Marcelo on 29/06/2017.
 */
export let clientMock = new (function() {
  this.response = null;

  let callFake = url => {
    return new Promise((resolve, reject) => {
      let res = this.response;
      if (this.response && this.response[url]) {
        res = this.response[url];
      }
      if (
        !res ||
        (res.status && res.status === 'error') ||
        res.status === 'failed'
      )
        reject(res);

      resolve(res);
    });
  };

  this.get = jasmine.createSpy('get').and.callFake(callFake);
  this.put = jasmine.createSpy('put').and.callFake(callFake);
  this.post = jasmine.createSpy('post').and.callFake(callFake);
  this.delete = jasmine.createSpy('delete').and.callFake(callFake);
})();
