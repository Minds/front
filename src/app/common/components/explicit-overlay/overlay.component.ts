import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Session } from '../../../services/session';
import { TopbarAlertService } from '../topbar-alert/topbar-alert.service';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';

/**
 * Overlay to cover NSFW entities pending a user
 * confirming they wish to view it and are over 18
 * years old.
 */
@Component({
  selector: 'm-explicit-overlay',
  templateUrl: 'overlay.component.html',
  styleUrls: ['./overlay.component.ng.scss'],
})
export class ExplicitOverlayComponent implements OnInit, OnDestroy {
  public hidden = true;
  public type: string;
  private _entity: any;
  private topbarAlertShownSubscription: Subscription;

  @Input() set entity(value: any) {
    if (value) {
      // change wording for entity label.
      this.type = value.type === 'user' ? 'channel' : value?.type;
      this._entity = value;
      this.initialize();
    }
  }

  @HostBinding('class.m-nsfwOverlay--topbarAlertShown')
  private topbarAlertShown: boolean;

  constructor(
    public session: Session,
    private topbarAlertService: TopbarAlertService
  ) {}

  ngOnInit(): void {
    this.topbarAlertShownSubscription = this.topbarAlertService.shouldShow$
      .pipe(distinctUntilChanged())
      .subscribe((shouldShow: boolean): void => {
        this.topbarAlertShown = shouldShow;
      });
  }

  ngOnDestroy(): void {
    this.topbarAlertShownSubscription?.unsubscribe();
  }

  /**
   * Hides overlay screen.
   * @returns { void }
   */
  public close(): void {
    this.hidden = true;
  }

  /**
   * Handles the showing of the nsfw overlay if appropriate.
   * @returns { void }
   */
  private initialize(): void {
    const loggedInUser: MindsUser = this.session.getLoggedInUser();
    if (!this._entity || (loggedInUser && loggedInUser.mature)) {
      this.hidden = true;
      return;
    }

    if (this._entity.is_mature) {
      this.hidden = false;
    } else if (this._entity.nsfw && this._entity.nsfw.length > 0) {
      this.hidden = false;
    } else if (this._entity.nsfw_lock && this._entity.nsfw_lock.length > 0) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }
}
