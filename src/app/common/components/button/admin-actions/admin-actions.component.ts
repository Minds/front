import { Component, Input } from '@angular/core';
import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-button--admin-actions',
  templateUrl: 'admin-actions.component.html'
})

export class AdminActionsButtonComponent {

  @Input() object: any;

  open: boolean = false;

  constructor(public session: Session, public client: Client) { }

  isSpam() {
    if (typeof this.object['spam'] !== 'undefined') {
      return this.object['spam'];
    }

    if (typeof this.object.flags !== 'undefined') {
      return this.object.flags['spam'];
    }

    return false;
  }

  async setSpam(value: boolean) {
    if (!this.object) {
      return;
    }

    if (typeof this.object['spam'] !== 'undefined') {
      this.object['spam'] = value;
    }

    if (typeof this.object.flags !== 'undefined') {
      this.object.flags['spam'] = value;
    }

    try {
      if (value) {
        await this.client.put(`api/v1/admin/spam/${this.object.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/spam/${this.object.guid}`);
      }
    } catch (e) {
      if (typeof this.object['spam'] !== 'undefined') {
        this.object['spam'] = !value;
      }

      if (typeof this.object.flags !== 'undefined') {
        this.object.flags['spam'] = value;
      }
    }
  }

  isDeleted() {
    if (typeof this.object['deleted'] !== 'undefined') {
      return this.object['deleted'];
    }

    if (typeof this.object.flags !== 'undefined') {
      return this.object.flags['deleted'];
    }

    return false;
  }

  async setDeleted(value: boolean) {
    if (!this.object) {
      return;
    }

    if (typeof this.object['deleted'] !== 'undefined') {
      this.object['deleted'] = value;
    }

    if (typeof this.object.flags !== 'undefined') {
      this.object.flags['deleted'] = value;
    }

    try {
      if (value) {
        await this.client.put(`api/v1/admin/delete/${this.object.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/delete/${this.object.guid}`);
      }
    } catch (e) {
      if (typeof this.object['deleted'] !== 'undefined') {
        this.object['deleted'] = !value;
      }

      if (typeof this.object.flags !== 'undefined') {
        this.object.flags['deleted'] = value;
      }
    }
  }
}
