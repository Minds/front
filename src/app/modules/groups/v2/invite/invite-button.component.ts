import { Component, Input } from '@angular/core';
import { GroupInviteModalService } from './invite.modal.service';
import { MindsGroup } from '../group.model';

/**
 * Click this button to open the group invite modal
 */
@Component({
  selector: 'm-group__inviteButton',
  template: `
    <m-button
      (onAction)="openInviteModal()"
      color="blue"
      stretch="true"
      i18n="@@COMMON__INVITE"
      >Invite</m-button
    >
  `,
})
export class GroupInviteButtonComponent {
  @Input() group: MindsGroup;
  constructor(private inviteModalService: GroupInviteModalService) {}

  async openInviteModal(): Promise<void> {
    await this.inviteModalService.present(this.group);
  }
}
