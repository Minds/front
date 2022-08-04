import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { BanModalComponent } from '../../../ban/modal/modal.component';
import { ReportCreatorComponent } from '../../../report/creator/creator.component';
import { Router } from '@angular/router';
import { BlockListService } from '../../../../common/services/block-list.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ModalService } from '../../../../services/ux/modal.service';

/**
 * Button containing a dropdown with user-related actions
 * Used only in the pro footer, should be removed
 */
@Component({
  selector: 'minds-button-user-dropdown',
  inputs: ['user'],
  outputs: ['userChanged'],
  templateUrl: './user-dropdown.html',
})
export class UserDropdownButton {
  user: any = {
    blocked: false,
  };
  userChanged: EventEmitter<any> = new EventEmitter();
  banToggle: boolean = false;
  banMonetizationToggle: boolean = false;
  viewEmailToggle: boolean = false;

  constructor(
    public session: Session,
    public client: Client,
    public modalService: ModalService,
    public router: Router,
    protected blockListService: BlockListService,
    private toasterService: ToasterService
  ) {}

  /**
   * Reindex the user
   */
  reindex() {
    this.client.post('api/v2/admin/reindex', { guid: this.user.guid });
  }

  async block() {
    this.user.blocked = true;

    try {
      await this.client.put('api/v1/block/' + this.user.guid, {});
      this.user.blocked = true;
      this.blockListService.add(`${this.user.guid}`);
    } catch (e) {
      this.user.blocked = false;
    }

    this.userChanged.emit(this.user);
  }

  async unBlock() {
    this.user.blocked = false;
    try {
      await this.client.delete('api/v1/block/' + this.user.guid, {});
      this.user.blocked = false;
      this.blockListService.remove(`${this.user.guid}`);
    } catch (e) {
      this.user.blocked = true;
    }

    this.userChanged.emit(this.user);
  }

  async subscribe() {
    this.user.subscribed = true;

    try {
      await this.client.post('api/v1/subscribe/' + this.user.guid, {});
      this.user.subscribed = true;
    } catch (e) {
      this.user.subscribed = false;
      this.toasterService.error(
        e.message || "You can't subscribe to this user"
      );
    }

    this.userChanged.emit(this.user);
  }

  async unSubscribe() {
    this.user.subscribed = false;

    try {
      await this.client.delete('api/v1/subscribe/' + this.user.guid, {});
      this.user.subscribed = false;
    } catch (e) {
      this.user.subscribed = true;
    }

    this.userChanged.emit(this.user);
  }

  ban() {
    this.user.banned = 'yes';
    this.modalService.present(BanModalComponent, { data: { user: this.user } });

    this.banToggle = false;
  }

  async unBan() {
    this.user.banned = 'no';
    try {
      await this.client.delete(`api/v1/admin/ban/${this.user.guid}`, {});
      this.user.banned = 'no';
    } catch (e) {
      this.user.banned = 'yes';
    }

    this.userChanged.emit(this.user);
  }

  async banMonetization() {
    this.user.ban_monetization = 'yes';
    try {
      await this.client.put(
        `api/v1/admin/monetization/ban/${this.user.guid}`,
        {}
      );
      this.user.ban_monetization = 'yes';
    } catch (e) {
      this.user.ban_monetization = 'no';
    }

    this.userChanged.emit(this.user);
    this.banMonetizationToggle = false;
  }

  async unBanMonetization() {
    this.user.ban_monetization = 'no';
    try {
      await this.client.delete(
        `api/v1/admin/monetization/ban/${this.user.guid}`,
        {}
      );
      this.user.ban_monetization = 'no';
    } catch (e) {
      this.user.ban_monetization = 'yes';
    }

    this.userChanged.emit(this.user);
  }

  toggleMenu(e) {
    e.stopPropagation();

    this.client.get('api/v1/block/' + this.user.guid).then((response: any) => {
      this.user.blocked = response.blocked;
    });

    if (this.session.isAdmin()) {
      this.client
        .get(`api/v1/admin/monetization/ban/${this.user.guid}`)
        .then((response: any) => {
          if (typeof response.banned !== 'undefined') {
            this.user.ban_monetization = response.banned ? 'yes' : 'no';
          }
        });
    }
  }

  report() {
    this.modalService.present(ReportCreatorComponent, {
      data: {
        entity: this.user,
      },
    });
  }

  async setSpam(value: boolean) {
    this.user['spam'] = value ? 1 : 0;

    try {
      if (value) {
        await this.client.put(`api/v1/admin/spam/${this.user.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/spam/${this.user.guid}`);
      }
    } catch (e) {
      this.user['spam'] = !value ? 1 : 0;
    }

    this.userChanged.emit(this.user);
  }

  async setExplicit(value: boolean) {
    this.user.is_mature = value;
    try {
      await this.client.post(`api/v1/entities/explicit/${this.user.guid}`, {
        value: value ? '1' : '0',
      });
    } catch (e) {
      this.user.is_mature = !value;
    }

    this.userChanged.emit(this.user);
  }

  async setNSFWLock(reasons: Array<{ label; value; selected }>) {
    const nsfw = reasons.map(reason => reason.value);
    this.client.post(`api/v2/admin/nsfw/${this.user.guid}`, { nsfw });
    this.user.nsfw = nsfw;
    this.userChanged.emit(this.user);
  }

  async setRating(rating: number) {
    await this.client.post(
      `api/v1/admin/rating/${this.user.guid}/${rating}`,
      {}
    );
    this.user.rating = rating;
    this.userChanged.emit(this.user);
  }

  viewLedger() {
    this.router.navigate([
      '/wallet/tokens/transactions',
      { remote: this.user.username },
    ]);
  }

  viewWithdrawals() {
    this.router.navigate(['/admin/withdrawals', { user: this.user.username }]);
  }

  async viewEmail() {
    this.viewEmailToggle = true;

    try {
      const { email } = (await this.client.get(
        `api/v2/admin/user/${this.user.username}/email`
      )) as any;
      this.user.email = email;
    } catch (e) {
      console.error('viewEmail', e);
    }
  }
}
