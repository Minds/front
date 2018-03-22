import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api/client';
import { ReportCreatorComponent } from '../../../modules/report/creator/creator.component';
import { MindsUser } from '../../../interfaces/entities';
import { SignupModalService } from '../../../modules/modals/signup/service';


type Option =
  'edit'
  | 'translate'
  | 'share'
  | 'mute'
  | 'unmute'
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
  | 'see-more-like-this'
  | 'see-less-like-this'
  | 'rating'
  | 'block';

@Component({
  moduleId: module.id,
  selector: 'm-post-menu',
  templateUrl: 'post-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PostMenuComponent {
  @Input() entity: any;
  @Input() options: Array<Option>;
  @Output() optionSelected: EventEmitter<Option> = new EventEmitter<Option>();
  @Input() canDelete: boolean = false;
  @Input() isTranslatable: boolean = false;
  @Input() askForCategoriesWhenFeaturing: boolean = false;
  @Input() user: any;

  featuredCategory: string = 'not-selected';

  asyncMute: boolean = false;
  asyncMuteInProgress: boolean = false;
  asyncBlockInProgress: boolean = false;
  asyncBlock: boolean = false;

  opened: boolean = false;

  shareToggle: boolean = false;
  deleteToggle: boolean = false;
  featureToggle: boolean = false;

  categories: Array<any> = [];

  constructor(public session: Session, private client: Client, private cd: ChangeDetectorRef, private overlayModal: OverlayModalService, public signupModal: SignupModalService) {
    this.initCategories();
  }

  initCategories() {
    for (let category in window.Minds.categories) {
      this.categories.push({
        id: category,
        label: window.Minds.categories[category],
      });
    }
  }

  cardMenuHandler() {
    this.opened = !this.opened;
    this.asyncMuteFetch();
    this.asyncBlockFetch();
  }

  asyncMuteFetch() {
    if (this.asyncMute || this.asyncMuteInProgress) {
      return;
    }

    this.asyncMuteInProgress = true;
    this.detectChanges();

    this.client.get(`api/v1/entities/notifications/${this.entity.guid}`)
      .then((response: any) => {
        this.asyncMuteInProgress = false;
        this.asyncMute = true;

        this.entity['is:muted'] = !!response['is:muted'];
        this.detectChanges();
      })
      .catch(e => {
        this.asyncMuteInProgress = false;
        this.detectChanges();
      });
  }

  mute() {
    this.entity['is:muted'] = true;

    this.client.post(`api/v1/entities/notifications/${this.entity.guid}/mute`)
      .then((response: any) => {
        if (response.done) {
          this.entity['is:muted'] = true;
          this.detectChanges();
          return;
        }

        throw new Error('E_NOT_DONE');
      })
      .catch(e => {
        this.entity['is:muted'] = false;
        this.detectChanges();
      });

    this.selectOption('mute');
  }

  unmute() {
    this.entity['is:muted'] = false;

    this.client.post(`api/v1/entities/notifications/${this.entity.guid}/unmute`)
      .then((response: any) => {
        if (response.done) {
          this.entity['is:muted'] = false;
          this.detectChanges();
          return;
        }

        throw new Error('E_NOT_DONE');
      })
      .catch(e => {
        this.entity['is:muted'] = true;
        this.detectChanges();
      });
    this.selectOption('unmute');
  }

  asyncBlockFetch() {
    if (this.asyncBlock || this.asyncBlockInProgress) {
      return;
    }

    this.asyncBlockInProgress = true;
    this.detectChanges();

    //Owner
    this.client.get(`api/v1/block/${this.entity.ownerObj.guid}`)
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
    this.client.delete('api/v1/block/' + this.entity.ownerObj.guid, {})
      .then((response: any) => {
        this.asyncBlock = false;
        this.detectChanges();
      })
      .catch((e) => {
        this.asyncBlock = true;
        this.detectChanges();
      });
    this.selectOption('block');
  }

  block() {
    this.client.put('api/v1/block/' + this.entity.ownerObj.guid, {})
      .then((response: any) => {
        this.asyncBlock = true;
        this.detectChanges();
      })
      .catch((e) => {
        this.asyncBlock = false;
        this.detectChanges();
      });
    this.selectOption('block');
  }

  share() {
    this.shareToggle = true;
    this.selectOption('share');
  }

  feature() {
    if (this.askForCategoriesWhenFeaturing && !this.featureToggle) {
      this.featureToggle = true;
      return;
    }
    this.entity.featured = true;

    this.client.put('api/v1/admin/feature/' + this.entity.guid + '/' + this.featuredCategory)
      .catch(() => {
        this.entity.featured = false;
        this.detectChanges();
      });
    this.selectOption('feature');
  }

  unFeature() {
    this.entity.featured = false;

    this.client.delete('api/v1/admin/feature/' + this.entity.guid)
      .catch(() => {
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
    console.warn(this.user, this.entity, this.session.getLoggedInUser().guid, this.entity.ownerObj.guid);
    this.overlayModal.create(ReportCreatorComponent, this.entity)
      .present();
    this.selectOption('report');
  }

  setExplicit(explicit: boolean) {
    this.selectOption(explicit ? 'set-explicit': 'remove-explicit');
  }

  monetize() {
    if (this.entity.monetized)
      return this.unMonetize();

    this.entity.monetized = true;

    this.client.put('api/v1/monetize/' + this.entity.guid, {})
      .catch((e) => {
        this.entity.monetized = false;
      });
  }

  unMonetize() {
    this.entity.monetized = false;
    this.client.delete('api/v1/monetize/' + this.entity.guid, {})
      .catch((e) => {
        this.entity.monetized = true;
      });
  }

  subscribe() {
    if (!this.session.isLoggedIn()) {
      this.signupModal.setSubtitle('You need to have a channel in order to subscribe').open();
      return false;
    }

    this.user.subscribed = true;
    this.client.post('api/v1/subscribe/' + this.user.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }

        this.user.subscribed = true;
      })
      .catch((e) => {
        this.user.subscribed = false;
        alert('You can\'t subscribe to this user.');
      });
  }

  unSubscribe() {
    this.user.subscribed = false;
    this.client.delete('api/v1/subscribe/' + this.user.guid, {})
      .then((response: any) => {
        this.user.subscribed = false;
      })
      .catch((e) => {
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

  seeMore() {
    this.client.put(`api/v1/categories/${this.session.getLoggedInUser().guid}/${this.entity.boosted_guid}`, {})
      .then((response: any) => {
        // this.user.subscribed = false;
      })
      .catch((e) => {
        // this.user.subscribed = true;
      });
  }

  seeLess() {
    this.client.delete(`api/v1/categories/${this.session.getLoggedInUser().guid}/${this.entity.boosted_guid}`, {})
      .then((response: any) => {
        // this.user.subscribed = false;
      })
      .catch((e) => {
        // this.user.subscribed = true;
      });
  }

  setRating(rating: number) {
    this.client.post(`api/v1/admin/rating/${this.entity.guid}/${rating}`, {})
      .then((response: any) => {
        this.entity.rating = rating;
        this.detectChanges();
      });
    this.selectOption('rating');
  }
}
