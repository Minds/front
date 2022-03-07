import {
  Component,
  HostBinding,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { FormToastService } from '../../services/form-toast.service';

@Component({
  selector: 'm-subscribeButton',
  templateUrl: './subscribe-button.component.html',
  styleUrls: ['./subscribe-button.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscribeButtonComponent implements OnInit {
  _user: any = {
    subscribed: false,
  };
  _content: any;
  _listener: Function;

  subscribed: boolean = false;
  inProgress: boolean = false;
  @Output('subscribed') onSubscribed: EventEmitter<any> = new EventEmitter();

  @Input() sized: boolean = false;
  @Input() iconOnly: boolean = false;

  // disable subscription - allows for a user to preview their own card.
  @Input() disableSubscribe: boolean = false;

  // When true, will use channel api to double check that the subscription status is correct
  // (used for entities that aren't normalised)
  @Input() enableRecheck: boolean = false;

  /**
   * the icon to show when user is subscribed to this channel
   */
  @Input() subscribedIcon = 'close';

  constructor(
    public session: Session,
    public client: Client,
    public authModal: AuthModalService,
    protected toasterService: FormToastService,
    protected cd: ChangeDetectorRef
  ) {}

  @Input('user')
  set user(value: any) {
    this._user = value;
  }

  ngOnInit(): void {
    if (!this._user || !this._user.guid) {
      return;
    }

    if (this.enableRecheck) {
      this.checkIfSubscribed();
    } else {
      this.subscribed = this._user.subscribed;
    }
  }

  async checkIfSubscribed(): Promise<void> {
    this.inProgress = true;

    await this.client
      .get(`api/v1/channel/${this._user.guid}`)
      .then((response: any) => {
        if (response && response.channel && response.channel.subscribed)
          this.subscribed = response.channel.subscribed;
      })
      .catch(e => {
        console.error('Problem fetching channel for subscribe button', e);
      });
    this.inProgress = false;
    this.detectChanges();
  }

  async subscribe(e): Promise<void> {
    e.preventDefault();
    e.stopPropagation();

    if (!this.session.isLoggedIn()) {
      await this.authModal.open();
    }
    this.subscribed = true;
    this.onSubscribed.next();

    this.client
      .post('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }

        this.subscribed = true;
      })
      .catch(e => {
        this.subscribed = false;
        this.toasterService.error(
          e.message || "You can't subscribe to this user"
        );
      });
  }

  unsubscribe(e) {
    e.preventDefault();
    e.stopPropagation();
    this.subscribed = false;
    this.client
      .delete('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        this.subscribed = false;
      })
      .catch(e => {
        this.subscribed = true;
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
