import {
  Component,
  EventEmitter,
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
import { FeaturesService } from '../../../../services/features.service';
import { TranslationService } from '../../../../services/translation';
import { ToasterService } from '../../../../common/services/toaster.service';
import { DownloadActivityMediaService } from '../../../../common/services/download-activity-media.service';
import { WireModalService } from '../../../wire/wire-modal.service';
import { ApiService } from '../../../../common/api/api.service';

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
  @Output() deleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() translate: EventEmitter<any> = new EventEmitter<any>();
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    public client: Client,
    private apiService: ApiService,
    private router: Router,
    private features: FeaturesService,
    private composer: ComposerService,
    private composerModal: ComposerModalService,
    private injector: Injector,
    public translationService: TranslationService,
    private toasterService: ToasterService,
    public downloadActivityMediaService: DownloadActivityMediaService,
    private wireModalService: WireModalService
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
        try {
          await this.client.delete(`api/v3/newsfeed/${this.entity.urn}`);
          this.deleted.emit();
        } catch (e) {
          this.toasterService.error(e.message);
        }

        break;
      case 'delete':
        try {
          await this.client.delete(`api/v1/newsfeed/${this.entity.guid}`);
          this.deleted.emit();
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
          this.deleted.emit(); // Will remove from feeds
        } catch (e) {
          this.toasterService.error(e.message);
        }
        break;
      case 'block':
        // !! This doesn't actually delete the post
        // It just hides the post from which user blocked its owner
        this.deleted.emit();
        break;
      case 'wire':
        await this.wireModalService.present(this.entity);
        break;
    }
  }
}
