import { EventEmitter, Injectable } from '@angular/core';
import { Session } from '../../services/session';
import { Client } from '../../services/api/client';

@Injectable()
export class NewsfeedBoostService {
  explicitChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  enableChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  pauseChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  enabled: boolean = true;
  paused: boolean = false;

  rating: number = 2; //default to Safe Mode Off

  constructor(private session: Session, private client: Client) {
    if (
      this.session.getLoggedInUser().plus &&
      this.session.getLoggedInUser().disabled_boost
    ) {
      this.enabled = false;
    }
    this.paused = !session.getLoggedInUser().boost_autorotate;
  }

  getBoostRating() {
    return this.rating;
  }

  isBoostEnabled() {
    return this.enabled;
  }

  isBoostPaused() {
    return this.paused;
  }

  setExplicit(active: boolean) {
    this.session.getLoggedInUser().mature = active;

    this.explicitChanged.emit(active);

    this.client
      .post('api/v1/settings/' + this.session.getLoggedInUser().guid, {
        mature: active,
        boost_rating: this.rating,
      })
      .catch(e => {
        this.session.getLoggedInUser().mature = !active;

        this.explicitChanged.emit(!active);
      });
  }

  togglePause() {
    this.paused = !this.paused;

    this.client.post('api/v1/settings', { boost_autorotate: !this.paused });
    this.pauseChanged.emit(this.paused);
  }

  hideBoost() {
    this.session.getLoggedInUser().disabled_boost = true;
    this.enabled = false;

    this.enableChanged.emit(this.enabled);

    this.client.put('api/v1/plus/boost').catch(() => {
      this.session.getLoggedInUser().disabled_boost = false;
      this.enabled = true;

      this.enableChanged.emit(this.enabled);
    });
  }

  showBoost() {
    this.session.getLoggedInUser().disabled_boost = false;
    this.enabled = true;

    this.enableChanged.emit(this.enabled);

    this.client.delete('api/v1/plus/boost').catch(() => {
      this.session.getLoggedInUser().disabled_boost = true;
      this.enabled = false;

      this.enableChanged.emit(this.enabled);
    });
  }
}
