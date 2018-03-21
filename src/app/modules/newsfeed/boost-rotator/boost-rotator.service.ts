import { Injectable } from '@angular/core';
import { NewsfeedBoostRotatorComponent } from './boost-rotator.component';

@Injectable()
export class BoostRotatorService {
  private boostRotator: NewsfeedBoostRotatorComponent;

  constructor() {
  }

  setBoostRotator(comp: NewsfeedBoostRotatorComponent) {
    this.boostRotator = comp;
  }

  isInitialized() {
    return !!this.boostRotator;
  }

  getBoostRating() {
    return this.boostRotator.rating;
  }

  setRating(rating) {
    this.boostRotator.setRating(rating);
  }

  isBoostEnabled() {
    return !this.boostRotator.disabled;
  }

  isBoostPaused() {
    return this.boostRotator.paused;
  }

  toggleRating() {
    this.boostRotator.toggleRating();
  }

  setExplicit(value: boolean) {
    this.boostRotator.setExplicit(value);
  }

  togglePause() {
    this.boostRotator.togglePause();
  }

  hideBoost() {
    this.boostRotator.disable();
  }

  showBoost() {
    this.boostRotator.enable();
  }
}
