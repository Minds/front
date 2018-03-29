import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';

@Injectable()
export class SettingsService {
  ratingChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(private client: Client, private session: Session) {
  }

  setRating(rating) {
    this.session.getLoggedInUser().boost_rating = rating;

    this.client.post('api/v1/settings/' + this.session.getLoggedInUser().guid, {
      boost_rating: rating,
    });

    this.ratingChanged.emit(rating);
  }
}