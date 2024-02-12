import {
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import {
  ActivityService,
  ActivityEntity,
} from '../../activity/activity.service';
import { Client } from '../../../../services/api/client';
import { ComposerService } from '../../../composer/services/composer.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { TranslationService } from '../../../../services/translation';
import { ToasterService } from '../../../../common/services/toaster.service';
import { DownloadActivityMediaService } from '../../../../common/services/download-activity-media.service';
import { WireModalService } from '../../../wire/wire-modal.service';
import { ApiService } from '../../../../common/api/api.service';
import { ModerationActionGqlService } from '../../../admin/moderation/services/moderation-action-gql.service';
import { Session } from '../../../../services/session';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

/**
 * Options for the activity's meatball menu (different options show for owners).
 * Mostly just a wrapper around 'm-postMenu--v2', but also handles actions for a few of the options,
 * if selected (e.g. 'delete' is handled here, but 'report' is handled in the post menu.)
 *
 * TODO: consolidate/centralise where actions are handled?
 */
@Component({
  selector: 'm-activity__menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.ng.scss'],
})
export class ActivityMenuComponent implements OnInit, OnDestroy {
  @Output() translate: EventEmitter<any> = new EventEmitter<any>();
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    public client: Client,
    private apiService: ApiService,
    private router: Router,
    private composer: ComposerService,
    private composerModal: ComposerModalService,
    private injector: Injector,
    public translationService: TranslationService,
    private toasterService: ToasterService,
    public downloadActivityMediaService: DownloadActivityMediaService,
    private wireModalService: WireModalService,
    private session: Session,
    private moderationActionsGql: ModerationActionGqlService,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
        this.entity.url = this.service.buildCanonicalUrl(this.entity, true);
      }
    );
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
  }

  get menuOptions(): Array<string> {
    if (!this.entity || !this.entity.ephemeral) {
      return [
        'boost',
        'edit',
        'pin',
        'translate',
        'share',
        'follow',
        'feature',
        'delete',
        'report',
        'set-explicit',
        'block',
        'rating',
        'allow-comments',
        'download',
        'wire',
        'hide-post',
        'view-federated',
      ];
    } else {
      return [
        'boost',
        'view',
        'translate',
        'share',
        'follow',
        'feature',
        'report',
        'set-explicit',
        'block',
        'rating',
        'allow-comments',
        'download',
        'view-federated',
      ];
    }
  }

  async onOptionSelected(option) {
    switch (option) {
      case 'edit':
        this.composerModal
          .setInjector(this.injector)
          .present()
          .then(activity => {
            if (activity) {
              this.service.setEntity(activity);
            }
          });

        // Set the data on next tick
        // This avoid the title not being visible
        setTimeout(() => this.composer.load(this.entity));

        break;
      case 'undo-remind':
        await this.service.undoRemind();
        break;
      case 'delete':
        try {
          await this.deleteActivity();
          this.service.onDelete();
        } catch (e) {
          this.toasterService.error(e.message);
          console.error(e);
        }
        break;
      case 'translate':
        this.service.displayOptions.showTranslation = true;
        break;
      case 'download':
        this.downloadActivityMediaService.download(this.entity);
        break;
      case 'hide-post':
        try {
          await this.apiService
            .put(`api/v3/newsfeed/hide-entities/` + this.entity.guid)
            .toPromise();
          this.service.onDelete();
        } catch (e) {
          this.toasterService.error(e.message);
        }
        break;
      case 'block':
        // !! This doesn't actually delete the post
        // It just hides the post from which user blocked its owner
        this.service.onDelete();
        break;
      case 'wire':
        await this.wireModalService.present(this.entity);
        break;
    }
  }

  /**
   * Handle activity deletion.
   * @returns { Promise<void> }
   */
  private async deleteActivity(): Promise<void> {
    if (
      !this.isTenantNetwork ||
      this.entity.ownerObj.guid === this.session.getLoggedInUser().guid
    ) {
      await this.client.delete(`api/v1/newsfeed/${this.entity.guid}`);
    } else {
      await this.moderationActionsGql.deleteEntity(this.entity.urn);
    }
  }
}
