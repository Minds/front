export let boostServiceMock = new function() {
  this.accept = true;
  this.reject = true;
  this.revoke = true;
  this.incoming = true;

  this.load = jasmine.createSpy('load');
  this.accept=jasmine.createSpy('accept');
  this.canAccept = jasmine.createSpy('canAccept').and.returnValue(this.accept);
  this.reject = jasmine.createSpy('reject');
  this.canReject = jasmine.createSpy('canReject').and.returnValue(this.reject);
  this.revoke = jasmine.createSpy('revoke');
  this.canRevoke = jasmine.createSpy('canRevoke').and.returnValue(this.revoke);
  this.isIncoming = jasmine.createSpy('isIncoming').and.returnValue(this.incoming);
};