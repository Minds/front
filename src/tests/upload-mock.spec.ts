/**
 * Created by Nicolas on 22/09/2017.
 */
/* tslint:disable */
export let uploadMock = new (function() {
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

  this.post = jasmine.createSpy('post').and.callFake(callFake);
})();
