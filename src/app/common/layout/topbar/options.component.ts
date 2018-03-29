import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../../../services/session';
import { SettingsService } from '../../../modules/settings/settings.service';

@Component({
  selector: 'm-topbar--navigation--options',
  templateUrl: 'options.component.html'
})

export class TopbarOptionsComponent {

  @Input() options: Array<string> = ['rating'];
  @Output() change: EventEmitter<{ rating }> = new EventEmitter;

  constructor(public session: Session, public settingsService: SettingsService) {
  }

  get rating() {
    return this.session.getLoggedInUser().boost_rating;
  }

  toggleRating() {
    switch (this.rating) {
      case 1:
        this.settingsService.setRating(2);
        break;
      case 2:
      default:
        this.settingsService.setRating(1);
        break;
    }
    this.change.next({ rating: this.rating });
    event.stopPropagation();
  }

}
