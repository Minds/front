import { Inject, Injectable, Injector } from '@angular/core';
import { EmbedServiceV2 } from '../../../services/embedV2.service';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { BlockListService } from '../../services/block-list.service';
import { ActivityService } from '../../services/activity.service';
import { MindsUser } from '../../../interfaces/entities';
import { BehaviorSubject } from 'rxjs';
import { ShareModalComponent } from '../../../modules/modals/share/share';
import { ReportCreatorComponent } from '../../../modules/report/creator/creator.component';
import { DialogService } from '../../services/confirm-leave-dialog.service';
import { ToasterService } from '../../services/toaster.service';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ModalService } from '../../../services/ux/modal.service';
import { SubscriptionService } from '../../services/subscription.service';
import { BoostModalV2LazyService } from '../../../modules/boost/modal-v2/boost-modal-v2-lazy.service';
import { ModerationActionGqlService } from '../../../modules/admin/moderation/services/moderation-action-gql.service';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import { PermissionsService } from '../../services/permissions.service';
import { BoostCancelModalService } from '../../../modules/boost/console-v2/services/cancel-modal.service';

@Injectable()
export class PostMenuService {
  entityOwner: MindsUser;
  entity: any;

  isLoadingFollowing = false;
  isFollowing$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  isLoadingBlock = false;
  isBlocked$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  isBanned$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  isExplicit$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  email$: BehaviorSubject<string> = new BehaviorSubject(null);
  showSubscribe$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  showUnSubscribe$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isPinned$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  canPin$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public session: Session,
    private client: Client,
    private modalService: ModalService,
    public authModal: AuthModalService,
    protected blockListService: BlockListService,
    protected activityService: ActivityService,
    private dialogService: DialogService,
    protected toasterService: ToasterService,
    public embedService: EmbedServiceV2,
    public subscriptionService: SubscriptionService,
    private boostModal: BoostModalV2LazyService,
    private moderationActionGql: ModerationActionGqlService,
    private permissionsService: PermissionsService,
    private boostCancelModalService: BoostCancelModalService,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  setEntity(entity): PostMenuService {
    this.entity = entity;

    this.isPinned$.next(this.entity.pinned);
    this.canPin$.next(
      this.entity.owner_guid == this.session.getLoggedInUser().guid &&
        !this.entity.dontPin
    );
    return this;
  }

  setEntityOwner(entityOwner: MindsUser): PostMenuService {
    this.entityOwner = entityOwner;
    return this;
  }

  /**
   * Subscribe to the owner
   */
  async subscribe(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) return;
    }

    this.entityOwner.subscribed = true;
    try {
      await this.subscriptionService.subscribe(this.entityOwner as MindsUser);
      this.entityOwner.subscribed = true;
    } catch (e) {
      this.entityOwner.subscribed = false;
      this.toasterService.error(
        e.message || "You can't subscribe to this user"
      );
    }
  }

  /**
   * Unsubscribe from the owner
   */
  async unSubscribe(): Promise<void> {
    this.entityOwner.subscribed = false;

    try {
      await this.subscriptionService.unsubscribe(this.entityOwner as MindsUser);
      this.entityOwner.subscribed = false;
    } catch (e) {
      this.entityOwner.subscribed = true;
    }
  }

  /**
   * Fetch the following status
   */
  async fetchFollowing(): Promise<void> {
    if (this.isLoadingFollowing) return;
    this.isLoadingFollowing = true;

    try {
      const response: any = await this.client.get(
        `api/v2/notifications/follow/${this.entity.guid}`
      );
      this.isFollowing$.next(!!response.postSubscription.following);
    } catch (e) {
    } finally {
      this.isLoadingFollowing = false;
    }
  }

  /**
   * Loads the blocked status
   */
  async fetchBlock(): Promise<void> {
    if (this.isLoadingBlock) return;

    this.isLoadingBlock = true;

    try {
      const response: any = await this.client.get(
        `api/v1/block/${this.entity.ownerObj.guid}`
      );
      this.isBlocked$.next(response.blocked);
    } catch (e) {
    } finally {
      this.isLoadingBlock = true;
    }
  }

  /**
   * Follows a posts notifications
   */
  async follow(): Promise<void> {
    this.isFollowing$.next(true);

    try {
      const response: any = await this.client.put(
        `api/v2/notifications/follow/${this.entity.guid}`
      );

      if (response.done) {
        return;
      }

      throw new Error('E_NOT_DONE');
    } catch (e) {
      this.isFollowing$.next(false);
    }
  }

  /**
   * Unfollows a posts notifications
   */
  async unfollow(): Promise<void> {
    this.isFollowing$.next(false);

    try {
      const response: any = this.client.delete(
        `api/v2/notifications/follow/${this.entity.guid}`
      );

      if (response.done) {
        return;
      }

      throw new Error('E_NOT_DONE');
    } catch (e) {
      this.isFollowing$.next(true);
    }
  }

  /**
   * Ban a user - note that at present this feature is only available for
   * tenant network moderators. Calling from a non-tenant will be a no-op.
   * @returns { Promise<void> }
   */
  async ban(): Promise<void> {
    if (!this.isTenantNetwork) {
      console.error(
        'Direct bans are only available for tenant network moderators'
      );
      return;
    }
    this.isBanned$.next(true);
    const result: boolean = await this.setTenantUserBanState(
      this.entity.ownerObj.guid,
      true
    );

    if (!result) {
      this.isBanned$.next(false);
    }
  }

  /**
   * Unban a user.
   * @returns { Promise<void> }
   */
  async unBan(): Promise<void> {
    this.isBanned$.next(false);

    try {
      if (this.isTenantNetwork) {
        const result: boolean = await this.setTenantUserBanState(
          this.entity.ownerObj.guid,
          false
        );

        if (!result) {
          this.isBanned$.next(true);
        }
        return;
      }

      await this.client.delete(
        'api/v1/admin/ban/' + this.entity.ownerObj.guid,
        {}
      );
    } catch (e) {
      this.isBanned$.next(true);
    }
  }

  async getEmail(): Promise<string> {
    try {
      const response: any = await this.client.get(
        `api/v2/admin/user/${this.entity.ownerObj.username}/email`
      );
      this.email$.next(response.email);
      return response.email;
    } catch (e) {
      console.error('viewEmail', e);
      this.email$.next(null);
    }
  }

  async setExplicit(explicit: boolean) {
    this.isExplicit$.next(explicit);
    try {
      await this.client.post(
        `api/v1/entities/explicit/${this.entity.ownerObj.guid}`,
        {
          value: explicit ? '1' : '0',
        }
      );
    } catch (e) {
      this.isExplicit$.next(!explicit);
    }
  }

  async reIndex(): Promise<void> {
    try {
      this.client.post('api/v2/admin/reindex', {
        guid: this.entity.ownerObj.guid,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async setRating(rating: number): Promise<void> {
    try {
      await this.client.post(
        `api/v1/admin/rating/${this.entity.ownerObj.guid}/${rating}`
      );
    } catch (e) {
      console.error(e);
    }
  }

  async setSeed(seed: boolean): Promise<void> {
    try {
      const uri = `api/v1/admin/seed/${this.entity.ownerObj.guid}/`;
      if (seed) {
        await this.client.post(uri);
        this.toasterService.success(
          `${this.entity.ownerObj.name} is now a seed.`
        );
      } else {
        await this.client.delete(uri);
        this.toasterService.success(
          `${this.entity.ownerObj.name} is no longer a seed.`
        );
      }
    } catch (e) {
      this.toasterService.error('Unable to make this channel a seed.');
      throw e;
    }
  }

  async block(): Promise<void | any> {
    this.isBlocked$.next(true);
    try {
      // Allow username in case guid isn't available bc channel is disabled
      const user = this.entity.ownerObj.guid || this.entity.ownerObj.username;

      await this.client.put('api/v1/block/' + user, {});
      this.blockListService.add(`${this.entity.ownerObj.guid}`);
    } catch (e) {
      if (e.errorId === 'Minds::Core::Security::Block::BlockLimitException') {
        this.toasterService.error(
          `You have reached the limit of blocked users. Please unblock someone else before blocking @${this.entity.ownerObj.name}`
        );
        this.isBlocked$.next(false);
        return e;
      }
    }
    this.blockListService.add(`${this.entity.ownerObj.guid}`);
  }

  async unBlock(): Promise<void> {
    this.isBlocked$.next(false);
    try {
      await this.client.delete('api/v1/block/' + this.entity.ownerObj.guid, {});
      this.blockListService.remove(`${this.entity.ownerObj.guid}`);
    } catch (e) {
      this.isBlocked$.next(true);
    }
  }

  /**
   * Change permissions on whether to allow comments on a post or not.
   * @param { boolean } allowed - whether users are to be allowed to comment the entity.
   * @returns { Promise<void> }
   */
  public async allowComments(allowed: boolean): Promise<void> {
    this.entity.allow_comments = allowed;
    const result = await this.activityService.toggleAllowComments(
      this.entity,
      allowed
    );
    if (result !== allowed) {
      this.entity.allow_comments = result;
    }
  }

  /**
   * Set NSFW as admin
   * @param { number[] } nsfw - NSFW values.
   * @returns { Promise<void> } - Awaitable.
   */
  async setNsfw(nsfw: number[]): Promise<void> {
    try {
      const response: any = await this.client.post(
        `api/v2/admin/nsfw/${this.entity.ownerObj.guid}`,
        {
          nsfw,
        }
      );
      this.entity.nsfw = nsfw;
    } catch (e) {
      if (e.message) {
        this.toasterService.error(e.message);
        return;
      }
      this.toasterService.error(e);
    }
  }

  async confirmDelete(): Promise<boolean> {
    return this.dialogService
      .confirm('Are you sure you want to delete this post?')
      .toPromise();
  }

  /**
   * Confirm the action of cancelling boosts.
   * @returns { Promise<boolean> } - Whether the user confirmed the action.
   */
  public async confirmBoostCancellation(): Promise<boolean> {
    return this.boostCancelModalService.confirmModeratorBoostCancellation();
  }

  async openShareModal(): Promise<void> {
    return this.modalService.present(ShareModalComponent, {
      data: {
        url: this.entity.url,
        embedCode:
          this.entity.custom_type === 'video' &&
          this.embedService.getIframeFromObject(this.entity),
      },
      modalDialogClass: 'm-overlayModal__share',
    }).result;
  }

  async openReportModal(): Promise<void> {
    return this.modalService.present(ReportCreatorComponent, {
      data: {
        entity: this.entity,
      },
    }).result;
  }

  async openBoostModal(): Promise<void> {
    try {
      if (!this.permissionsService.canBoost()) {
        this.toasterService.error('You have no permission to Boost');
        return;
      }
      await this.boostModal.open(this.entity);
      return;
    } catch (e) {
      // do nothing.
    }
  }

  /**
   * Toggles the pinned state
   * @return void
   */
  async togglePinned(): Promise<void> {
    if (this.session.getLoggedInUser().guid != this.entity.owner_guid) {
      return;
    }

    this.entity.pinned = !this.entity.pinned;
    this.isPinned$.next(this.entity.pinned);
    const url: string = `api/v2/newsfeed/pin/${this.entity.guid}`;
    try {
      if (this.entity.pinned) {
        await this.client.post(url);
      } else {
        await this.client.delete(url);
      }
    } catch (e) {
      this.entity.pinned = !this.entity.pinned;
      this.isPinned$.next(this.entity.pinned);
    }
  }

  /**
   * Set tenant user ban state.
   * @param { string } subjectGuid - The guid of the user to ban.
   * @param { boolean } banState - The state to set the user to.
   * @returns { Promise<boolean> } - Whether the user was successfully banned.
   */
  private async setTenantUserBanState(
    subjectGuid: string,
    banState: boolean = true
  ): Promise<boolean> {
    return this.moderationActionGql.setUserBanState(subjectGuid, banState);
  }
}
