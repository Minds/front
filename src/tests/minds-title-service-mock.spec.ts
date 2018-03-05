export let mindsTitleMock = new function () {
  this.counter = 0;
  this.sep = ' | ';
  this.default_title = 'Minds';
  this.text = '';

  this.setTitle = jasmine.createSpy('setTitle').and.stub();
  this.setCounter = jasmine.createSpy('setTitle').and.stub();
  this.applyTitle = jasmine.createSpy('setTitle').and.stub();

};
