import { EventEmitter } from '@angular/core';

export let topbarHashtagsServiceMock = new function () {
  this.selectionChange = new EventEmitter();
  this.toggleSelection = jasmine.createSpy('toggleSelection').and.stub();

  this.loadResponse = [
    {
      value: 'hashtag1',
      selected: true
    },
    {
      value: 'hashtag2',
      selected: false
    }
  ];

  this.load = jasmine.createSpy('load').and.callFake(async () => {
    return this.loadResponse;
  });
};