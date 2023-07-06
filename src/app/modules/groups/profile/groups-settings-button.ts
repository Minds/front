import {
  Component,
  Input,
  Output,
  EventEmitter,
  Injector,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GroupsService } from '../groups.service';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { ToasterService } from '../../../common/services/toaster.service';
import { ConfirmV2Component } from '../../modals/confirm-v2/confirm.component';
import { ModalService } from '../../../services/ux/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'minds-groups-settings-button',
  templateUrl: 'groups-settings-button.html',
  styleUrls: ['./groups-settings-button.ng.scss'],
})
export class GroupsSettingsButton implements OnInit, OnDestroy {
  group: any = {
    'is:muted': false,
    deleted: false,
  };

  /**
   * Whether to use v2 styles and items
   * (i.e. Gatherings are removed in v2)
   */
  @Input() v2: boolean = false;

  @Input('group') set _group(value: any) {
    if (!value) return;
    this.group = value;
    this.featured = value.featured_id || value.featured === true;
  }

  @Output() groupChange: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  editing: boolean = false;
  showMenu: boolean = false;

  categories: Array<any> = [];
  category: string = 'not-selected';

  featured: boolean = false;

  featureModalOpen: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    public service: GroupsService,
    public client: Client,
    public session: Session,
    private injector: Injector,
    public modalService: ModalService,
    public router: Router,
    protected route: ActivatedRoute,
    protected toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      // Hacky workaround for v2 groups so we can use v1 groups to do editing.
      // If we don't change this here, we won't be able to access the 'save' option
      this.route.queryParams.subscribe(params => {
        if (params['editing']) {
          this.editing = params['editing'];
        }
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async mute() {
    this.group['is:muted'] = true;

    try {
      const isMuted: boolean = await this.service.muteNotifications(this.group);
      this.group['is:muted'] = isMuted;
    } catch (e) {
      this.group['is:muted'] = false;
    }

    this.showMenu = false;
  }

  async unmute() {
    this.group['is:muted'] = false;

    try {
      const isMuted: boolean = await this.service.unmuteNotifications(
        this.group
      );
      this.group['is:muted'] = isMuted;
    } catch (e) {
      this.group['is:muted'] = true;
    }

    this.showMenu = false;
  }

  openFeatureModal() {
    this.featureModalOpen = true;
  }

  async feature() {
    this.featured = true;
    this.group.featured = true;

    try {
      await this.client.put(
        `api/v1/admin/feature/${this.group.guid}/${this.category}`,
        {}
      );
      this.featureModalOpen = false;
    } catch (e) {
      this.featured = false;
    }
  }

  async unfeature() {
    this.featured = false;
    this.group.featured = false;

    try {
      await this.client.delete(`api/v1/admin/feature/${this.group.guid}`);
    } catch (e) {
      this.featured = true;
    }
  }

  onFeatureModalClose(e) {
    this.featureModalOpen = false;
  }

  report() {
    return this.modalService.present(ReportCreatorComponent, {
      data: {
        entity: this.group,
      },
    });
  }

  async toggleConversation(enabled: boolean) {
    try {
      this.group.conversationDisabled = !enabled;
      await this.service.toggleConversation(this.group.guid, enabled);
    } catch (e) {
      this.group.conversationDisabled = enabled;
    }
  }

  /**
   * deletePrompt
   * Displays the delete prompt if deletion is possible
   */
  async deletePrompt() {
    this.openConfirmationModal();
  }

  setExplicit(value) {
    this.service.setExplicit(this.group.guid, value).then(result => {
      if (result) {
        this.group.mature = value;
      }
    });
  }

  delete() {
    this.group.deleted = true;

    this.service.deleteGroup(this.group).then(deleted => {
      this.group.deleted = deleted;

      if (deleted) {
        this.toasterService.success('Your group has been successfully deleted');
        this.router.navigate(['/']);
      }
    });

    this.showMenu = false;
  }

  toggleMenu(e) {
    e.stopPropagation();
    if (this.showMenu) {
      this.showMenu = false;

      return;
    }
    this.showMenu = true;
    // TODO: [emi] Maybe refresh state?
  }

  toggleEdit() {
    this.editing = !this.editing;
    this.showMenu = false;
    this.change.emit({ editing: this.editing });
  }

  toggleVideoChat(enabled: boolean) {
    this.group.videoChatDisabled = enabled ? 0 : 1;
    this.client.post(`api/v1/groups/group/${this.group.guid}`, {
      videoChatDisabled: this.group.videoChatDisabled,
    });
    this.groupChange.next(this.group);
  }

  toggleModeration(enabled: boolean) {
    this.group.moderated = enabled ? 1 : 0;
    this.client.post(`api/v1/groups/group/${this.group.guid}`, {
      moderated: this.group.moderated,
    });
    this.groupChange.next(this.group);
  }

  togglePublic(enabled: boolean) {
    this.group.membership = enabled ? 2 : 0;
    this.client.post(`api/v1/groups/group/${this.group.guid}`, {
      membership: this.group.membership,
    });
    this.groupChange.next(this.group);
  }

  onNSFWSelected(reasons: Array<{ label; value; selected }>) {
    console.log('group', this.group);
    const nsfw = reasons.map(reason => reason.value);
    this.client.post(`api/v2/admin/nsfw/${this.group.guid}`, { nsfw });
    this.group.nsfw = nsfw;
  }

  /**
   * Opens confirmation of deletion modal
   * @returns { void }
   */
  public openConfirmationModal(): void {
    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Delete Group',
        body:
          'Are you sure you want to delete this? This action cannot be undone.',
        confirmButtonColor: 'red',
        onConfirm: () => {
          this.delete();
          this.router.navigate(['/']);
          modal.dismiss();
        },
      },
      injector: this.injector,
    });
  }
}
