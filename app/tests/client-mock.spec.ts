/**
 * Created by Marcelo on 29/06/2017.
 */
export let clientMock = new function () {
  this.response = null;

  let callFake = () => {
    return new Promise((resolve, reject) => {
      if (this.response && this.response.status && this.response.status === 'error' || this.response.status === 'failed')
        reject(this.response);

      resolve(this.response);
    });
  };

  this.get = jasmine.createSpy('get').and.callFake(callFake);
  this.put = jasmine.createSpy('put').and.callFake(callFake);
  this.post = jasmine.createSpy('post').and.callFake(callFake);
  this.delete = jasmine.createSpy('delete').and.callFake(callFake);
};