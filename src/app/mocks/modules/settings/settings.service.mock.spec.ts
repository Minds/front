import { EventEmitter } from '@angular/core';

export let settingsServiceMock = new function () {
  this.ratingChanged = new EventEmitter<number>();
  this.setRating = jasmine.createSpy('rating').and.callFake((rating) => {
    this.ratingChanged.emit(rating);
  });
};