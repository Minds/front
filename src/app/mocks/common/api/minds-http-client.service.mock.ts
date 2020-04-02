/**
 * Created by Marcelo on 14/01/2019.
 */
import { Observable } from 'rxjs';

export let mindsHttpClientMock = new (function() {
  this.response = null;

  let callFake = url => {
    return new Observable(observer => {
      let res = this.response;
      if (this.response && this.response[url]) {
        res = this.response[url];
      }
      if (
        !res ||
        (res.status && res.status === 'error') ||
        res.status === 'failed'
      )
        observer.error(res);

      observer.next(res);
      observer.complete();
    });
  };

  this.get = jasmine.createSpy('get').and.callFake(callFake);
  this.put = jasmine.createSpy('put').and.callFake(callFake);
  this.post = jasmine.createSpy('post').and.callFake(callFake);
  this.delete = jasmine.createSpy('delete').and.callFake(callFake);
})();
