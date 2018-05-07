import { EventEmitter } from '@angular/core';

export let signupModalServiceMock = new function () {
  this.defaultSubtitle = 'Signup to comment, upload, vote and earn 100+ free views on your content daily.';
  this.subtitle = this.defaultSubtitle;
  this.isOpen = new EventEmitter();
  this.display = new EventEmitter();

  this.route = '';
  this.scroll_listener = null;

  this.open = jasmine.createSpy('open').and.callFake(() => {
    this.isOpen.next(true);
  });

  this.close = jasmine.createSpy('close').and.callFake(() => {
    this.isOpen.next(false);
    this.display.next('initial');
    this.subtitle = this.defaultSubtitle;
  });

  this.setSubtitle = jasmine.createSpy('setSubtitle').and.callFake((text) => {
    this.subtitle = text;
  });

  this.setDisplay = jasmine.createSpy('setDisplay').and.callFake((display) => {
    this.display.next(display);
    return this;
  });
};