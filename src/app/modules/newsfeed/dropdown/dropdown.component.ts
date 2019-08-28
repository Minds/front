import { Component, Input, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { NewsfeedBoostService } from '../newsfeed-boost.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { SettingsService } from '../../settings/settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'm-newsfeed--dropdown',
  templateUrl: 'dropdown.component.html',
})
export class NewsfeedDropdownComponent implements OnInit {
  boostRating: number = 2;
  plus: boolean = false;
  @Input('showBoost') showBoostOptions: boolean = true;

  constructor(
    public session: Session,
    public router: Router,
    public boostService: NewsfeedBoostService,
    private newsfeedService: NewsfeedService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.boostRating = this.session.getLoggedInUser().boost_rating;
    this.plus = this.session.getLoggedInUser().plus;
  }

  setExplicit(value: boolean) {
    this.boostService.setExplicit(value);
  }

  toggleBoostPause() {
    this.boostService.togglePause();
  }

  hideBoost() {
    this.boostService.hideBoost();
  }

  showBoost() {
    this.boostService.showBoost();
  }

  selectCategories() {
    this.router.navigate(['/settings/general', 'categories']);
  }

  onNSFWSelected(reasons) {
    this.newsfeedService.setNSFW(reasons);
  }

  toggleRating(e) {
    switch (this.rating) {
      case 1:
        this.settingsService.setRating(2);
        break;
      case 2:
      default:
        this.settingsService.setRating(1);
        break;
    }
    e.stopPropagation();
  }

  get rating(): number {
    return this.session.getLoggedInUser().boost_rating;
  }
}
