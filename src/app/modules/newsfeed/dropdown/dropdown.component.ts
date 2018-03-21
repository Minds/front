import { Component, Input, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { BoostRotatorService } from '../boost-rotator/boost-rotator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'm-newsfeed--dropdown',
  templateUrl: 'dropdown.component.html'
})

export class NewsfeedDropdownComponent implements OnInit {

  boostRating: number = 2;
  plus: boolean = false;
  showBoostOptions: boolean = true;

  constructor(
    public session: Session,
    public router: Router,
    public boostRotatorService: BoostRotatorService
  ) {
  }

  ngOnInit() {
    this.boostRating = this.session.getLoggedInUser().boost_rating;
    this.plus = this.session.getLoggedInUser().plus;
  }

  setExplicit(value: boolean) {
    this.boostRotatorService.setExplicit(value);
  }

  toggleBoostPause() {
    this.boostRotatorService.togglePause();
  }

  hideBoost() {
    this.boostRotatorService.hideBoost();
  }

  showBoost() {
    this.boostRotatorService.showBoost();
  }

  selectCategories() {
    this.router.navigate(['/settings/general', 'categories']);
  }

  onOptionsChange(e: { rating }) {
    this.boostRotatorService.setRating(e.rating);
  }

}
