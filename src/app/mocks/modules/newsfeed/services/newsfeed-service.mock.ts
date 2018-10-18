import { EventEmitter } from '@angular/core';

export let newsfeedServiceMock = new function () {
  this.onReloadFeed = new EventEmitter();

  this.reloadFeed = () => {
    this.onReloadFeed.emit();
  }
};