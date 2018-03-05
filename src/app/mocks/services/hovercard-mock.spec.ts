export let hovercardServiceMock = new function () {
  this.shown = false;
  this.guid = '';
  this.data = null;

  this.anchor = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  };

  this.sticky = false;

  this.show = jasmine.createSpy('show').and.stub();

  this.hide = jasmine.createSpy('hide').and.stub();

  this.stick = jasmine.createSpy('stick').and.stub();

  this.unstick = jasmine.createSpy('unstick').and.stub();

  this.setAnchor = jasmine.createSpy('setAnchor').and.stub();
}
