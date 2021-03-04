import {
  Component,
  HostBinding,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { FormToastService } from '../../services/form-toast.service';

@Component({
  selector: 'm-subscribeButton',
  templateUrl: './subscribe-button.component.html',
  styleUrls: ['./subscribe-button.component.ng.scss'],
})
export class SubscribeButtonComponent {
  _user: any = {
    subscribed: false,
  };
  _content: any;
  _listener: Function;
  @Output('subscribed') onSubscribed: EventEmitter<any> = new EventEmitter();

  @Input() iconOnly: boolean = false;

  constructor(
    public session: Session,
    public client: Client,
    public authModal: AuthModalService,
    protected toasterService: FormToastService
  ) {}

  @Input('user')
  set user(value: any) {
    this._user = value;
  }

  async subscribe(e): Promise<void> {
    e.preventDefault();
    e.stopPropagation();

    if (!this.session.isLoggedIn()) {
      await this.authModal.open();
    }
    this._user.subscribed = true;
    this.onSubscribed.next();

    this.client
      .post('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }

        this._user.subscribed = true;
      })
      .catch(e => {
        this._user.subscribed = false;
        this.toasterService.error("You can't subscribe to this user.");
      });
  }

  unsubscribe(e) {
    e.preventDefault();
    e.stopPropagation();
    this._user.subscribed = false;
    this.client
      .delete('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        this._user.subscribed = false;
      })
      .catch(e => {
        this._user.subscribed = true;
      });
  }
}
