import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { Session } from '../../../services/session';
import { ToasterService } from '../../services/toaster.service';
import { SubscriptionService } from '../../services/subscription.service';
import { MindsUser } from './../../../interfaces/entities';
import { ButtonSize } from '../button/button.component';

export type SubscribeButtonLabelType = 'action' | 'pastTense';

@Component({
  selector: 'm-subscribeButton',
  templateUrl: './subscribe-button.component.html',
  styleUrls: ['./subscribe-button.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscribeButtonComponent implements OnInit {
  _user: Partial<MindsUser> = {
    subscribed: false,
  };

  _content: any;
  _listener: Function;
  subscribed: boolean = false;
  inProgress: boolean = false;

  @Output('subscribed') onSubscribed: EventEmitter<Partial<MindsUser>> =
    new EventEmitter();

  @Output('unsubscribed') onUnsubscribed: EventEmitter<Partial<MindsUser>> =
    new EventEmitter();

  @Input() sized: boolean = false;

  // only show the icons, no text
  @Input() iconOnly: boolean = false;

  // show the add/close icons next to the text.
  @Input() showIconWithText: boolean = true;

  // the size of the m-button
  @Input() size: ButtonSize = 'xsmall';

  // disable the button after the user subscribes
  @Input() disableAfterSubscribe: boolean = false;

  // When true, will use channel api to double check that the subscription status is correct
  // (used for entities that aren't normalised)
  @Input() enableRecheck: boolean = false;

  /**
   * the icon to show when user is subscribed to this channel
   */
  @Input() subscribedIcon = 'close';

  /**
   * If false, display as a string of text instead of an outlined button
   * (see activity owner blocks for example)
   */
  @Input()
  displayAsButton: boolean = true;

  /**
   * action - Buttons say "Subscribe" & "Unsubscribe"
   * pastTense - Buttons say "Subscribe" & "Subscribed"
   */
  @Input()
  labelType: SubscribeButtonLabelType = 'action';

  /**
   * Disables button so a user can't subscribe to themself
   */
  isOwnChannel: boolean = false;

  constructor(
    public session: Session,
    public authModal: AuthModalService,
    protected toasterService: ToasterService,
    protected cd: ChangeDetectorRef,
    protected subscriptionService: SubscriptionService
  ) {}

  @Input('user')
  set user(value: any) {
    this._user = value;
  }

  ngOnInit(): void {
    if (!this._user || !this._user.guid) {
      return;
    }

    if (this.session.getLoggedInUser()) {
      this.isOwnChannel =
        this._user.guid === this.session.getLoggedInUser().guid;
    }

    if (this.enableRecheck) {
      this.checkIfSubscribed();
    } else {
      this.subscribed = this._user.subscribed;
    }
  }

  async checkIfSubscribed(): Promise<void> {
    this.inProgress = true;

    await this.subscriptionService
      .isSubscribed(this._user as MindsUser)
      .then((subscribed) => (this.subscribed = subscribed))
      .catch((e) => {
        console.error('Problem fetching channel for subscribe button', e);
      });

    this.inProgress = false;
    this.detectChanges();
  }

  async subscribe(e): Promise<void> {
    e.preventDefault();
    e.stopPropagation();

    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) return;
    }
    this.subscribed = true;
    this.onSubscribed.emit(this._user);

    try {
      await this.subscriptionService.subscribe(this._user as MindsUser);
      this.subscribed = true;
    } catch (e) {
      this.subscribed = false;
      this.toasterService.error(
        e.message || "You can't subscribe to this user"
      );
    }
  }

  async unsubscribe(e) {
    e.preventDefault();
    e.stopPropagation();
    this.subscribed = false;
    this.onUnsubscribed.emit(this._user);
    try {
      await this.subscriptionService.unsubscribe(this._user as MindsUser);
      this.subscribed = false;
    } catch (e) {
      this.subscribed = true;
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
