import { Observable } from 'rxjs';

export let apiServiceMock = new (function() {
  this.get = jasmine.createSpy('get').and.returnValue(new Observable(null));
  this.post = jasmine.createSpy('post').and.returnValue(new Observable(null));
  this.put = jasmine.createSpy('put').and.returnValue(new Observable(null));
  this.delete = jasmine
    .createSpy('delete')
    .and.returnValue(new Observable(null));
})();
