/////
/// This component is deprevted.
/// Use v2 for new components
/////

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { Session } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api/client';
import { ReportCreatorComponent } from '../../../modules/report/creator/creator.component';
import { MindsUser } from '../../../interfaces/entities';
import { SignupModalService } from '../../../modules/modals/signup/service';
import { BlockListService } from '../../services/block-list.service';
import { ActivityService } from '../../../common/services/activity.service';
import { FeaturesService } from '../../../services/features.service';
import { ShareModalComponent } from '../../../modules/modals/share/share';

type Option =
  | 'edit'
  | 'view'
  | 'translate'
  | 'share'
  | 'follow'
  | 'unfollow'
  | 'feature'
  | 'unfeature'
  | 'delete'
  | 'report'
  | 'set-explicit'
  | 'remove-explicit'
  | 'monetize'
  | 'unmonetize'
  | 'subscribe'
  | 'unsubscribe'
  | 'rating'
  | 'block'
  | 'allow-comments';

@Component({
  moduleId: module.id,
  selector: 'm-post-menu',
  templateUrl: 'post-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostMenuComponent implements OnInit {
  @Input() entity: any;
  @Input() options: Array<Option>;
  @Output() optionSelected: EventEmitter<Option> = new EventEmitter<Option>();
  @Input() canDelete: boolean = false;
  @Input() isTranslatable: boolean = false;
  @Input() askForCategoriesWhenFeaturing: boolean = false;
  @Input() user: any;

  featuredCategory: string = 'not-selected';

  asyncFollow: boolean = false;
  asyncFollowInProgress: boolean = false;
  asyncBlockInProgress: boolean = false;
  asyncBlock: boolean = false;

  opened: boolean = false;

  deleteToggle: boolean = false;
  featureToggle: boolean = false;

  categories: Array<any> = [];

  constructor(
    public session: Session,
    private client: Client,
    private cd: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    public signupModal: SignupModalService,
    protected blockListService: BlockListService,
    protected activityService: ActivityService,
    public featuresService: FeaturesService
  ) {}

  ngOnInit() {}

  cardMenuHandler() {
    this.opened = !this.opened;
    this.asyncFollowFetch();
    this.asyncBlockFetch();
  }

  asyncFollowFetch() {
    if (this.asyncFollow || this.asyncFollowInProgress) {
      return;
    }

    this.asyncFollowInProgress = true;
    this.detectChanges();

    this.client
      .get(`api/v2/notifications/follow/${this.entity.guid}`)
      .then((response: any) => {
        this.asyncFollowInProgress = false;
        this.asyncFollow = true;

        this.entity['is:following'] = !!response.postSubscription.following;
        this.detectChanges();
      })
      .catch(e => {
        this.asyncFollowInProgress = false;
        this.detectChanges();
      });
  }

  follow() {
    this.entity['is:following'] = true;

    this.client
      .put(`api/v2/notifications/follow/${this.entity.guid}`)
      .then((response: any) => {
        if (response.done) {
          this.entity['is:following'] = true;
          this.detectChanges();
          return;
        }

        throw new Error('E_NOT_DONE');
      })
      .catch(e => {
        this.entity['is:following'] = false;
        this.detectChanges();
      });

    this.selectOption('follow');
  }

  unfollow() {
    this.entity['is:following'] = false;

    this.client
      .delete(`api/v2/notifications/follow/${this.entity.guid}`)
      .then((response: any) => {
        if (response.done) {
          this.entity['is:following'] = false;
          this.detectChanges();
          return;
        }

        throw new Error('E_NOT_DONE');
      })
      .catch(e => {
        this.entity['is:following'] = true;
        this.detectChanges();
      });
    this.selectOption('unfollow');
  }

  asyncBlockFetch() {
    if (this.asyncBlock || this.asyncBlockInProgress) {
      return;
    }

    this.asyncBlockInProgress = true;
    this.detectChanges();

    //Owner
    this.client
      .get(`api/v1/block/${this.entity.ownerObj.guid}`)
      .then((response: any) => {
        this.asyncBlockInProgress = false;
        this.asyncBlock = response.blocked;
        this.detectChanges();
      })
      .catch(e => {
        this.asyncBlockInProgress = false;
        this.detectChanges();
      });
  }

  unBlock() {
    this.client
      .delete('api/v1/block/' + this.entity.ownerObj.guid, {})
      .then((response: any) => {
        this.asyncBlock = false;
        this.detectChanges();

        this.blockListService.remove(`${this.entity.ownerObj.guid}`);
      })
      .catch(e => {
        this.asyncBlock = true;
        this.detectChanges();
      });
    this.selectOption('block');
  }

  block() {
    this.client
      .put('api/v1/block/' + this.entity.ownerObj.guid, {})
      .then((response: any) => {
        this.asyncBlock = true;
        this.detectChanges();

        this.blockListService.add(`${this.entity.ownerObj.guid}`);
      })
      .catch(e => {
        this.asyncBlock = false;
        this.detectChanges();
      });
    this.selectOption('block');
  }

  feature() {
    if (this.askForCategoriesWhenFeaturing && !this.featureToggle) {
      this.featureToggle = true;
      return;
    }
    this.entity.featured = true;

    this.client
      .put(
        'api/v1/admin/feature/' + this.entity.guid + '/' + this.featuredCategory
      )
      .catch(() => {
        this.entity.featured = false;
        this.detectChanges();
      });
    this.selectOption('feature');
  }

  unFeature() {
    this.entity.featured = false;

    this.client.delete('api/v1/admin/feature/' + this.entity.guid).catch(() => {
      this.entity.featured = true;
      this.detectChanges();
    });
    this.selectOption('unfeature');
  }

  delete() {
    this.deleteToggle = false;
    this.selectOption('delete');
  }

  report() {
    console.warn(
      this.user,
      this.entity,
      this.session.getLoggedInUser().guid,
      this.entity.ownerObj.guid
    );
    this.overlayModal.create(ReportCreatorComponent, this.entity).present();
    this.selectOption('report');
  }

  setExplicit(explicit: boolean) {
    this.selectOption(explicit ? 'set-explicit' : 'remove-explicit');
  }

  monetize() {
    if (this.entity.monetized) return this.unMonetize();

    this.entity.monetized = true;

    this.client.put('api/v1/monetize/' + this.entity.guid, {}).catch(e => {
      this.entity.monetized = false;
    });
  }

  unMonetize() {
    this.entity.monetized = false;
    this.client.delete('api/v1/monetize/' + this.entity.guid, {}).catch(e => {
      this.entity.monetized = true;
    });
  }

  subscribe() {
    if (!this.session.isLoggedIn()) {
      this.signupModal
        .setSubtitle('You need to have a channel in order to subscribe')
        .open();
      return false;
    }

    this.user.subscribed = true;
    this.client
      .post('api/v1/subscribe/' + this.user.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }

        this.user.subscribed = true;
      })
      .catch(e => {
        this.user.subscribed = false;
        alert("You can't subscribe to this user.");
      });
  }

  unSubscribe() {
    this.user.subscribed = false;
    this.client
      .delete('api/v1/subscribe/' + this.user.guid, {})
      .then((response: any) => {
        this.user.subscribed = false;
      })
      .catch(e => {
        this.user.subscribed = true;
      });
  }

  selectOption(option: Option) {
    this.optionSelected.emit(option);
    this.opened = false;

    this.detectChanges();
  }

  onModalClose() {
    this.featureToggle = false;
  }

  detectChanges() {
    this.cd.markForCheck();
  }

  setRating(rating: number) {
    this.client
      .post(`api/v1/admin/rating/${this.entity.guid}/${rating}`, {})
      .then((response: any) => {
        this.entity.rating = rating;
        this.detectChanges();
      });
    this.selectOption('rating');
  }

  onNSFWSelected(reasons: Array<{ label; value; selected }>) {
    const nsfw = reasons.map(reason => reason.value);
    this.client.post(`api/v2/admin/nsfw/${this.entity.guid}`, { nsfw });
    this.entity.nsfw = nsfw;
  }

  async allowComments(areAllowed: boolean) {
    this.entity.allow_comments = areAllowed;
    const result = await this.activityService.toggleAllowComments(
      this.entity,
      areAllowed
    );
    if (result !== areAllowed) {
      this.entity.allow_comments = result;
    }
  }

  openShareModal() {
    this.overlayModal
      .create(ShareModalComponent, this.entity.url, {
        class: 'm-overlay-modal--medium m-overlayModal__share',
      })
      .present();

    this.selectOption('share');
  }
}
