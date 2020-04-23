import {
  Component,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import { ActivityService, ActivityEntity } from '../activity.service';
import { Client } from '../../../../services/api/client';
import { ComposerService } from '../../../composer/services/composer.service';
import { ModalService } from '../../../composer/components/modal/modal.service';
import { FeaturesService } from '../../../../services/features.service';
import { ComposerBlogsService } from '../../../composer/services/blogs.service';

@Component({
  selector: 'm-activity__menu',
  templateUrl: 'menu.component.html',
})
export class ActivityMenuComponent implements OnInit, OnDestroy {
  @Output() deleted: EventEmitter<any> = new EventEmitter<any>();
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    public client: Client,
    private router: Router,
    private features: FeaturesService,
    private composer: ComposerService,
    private blogsService: ComposerBlogsService,
    private composerModal: ModalService,
    private injector: Injector
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
      if (this.service.displayOptions.showBoostMenuOptions) {
        return [
          'edit',
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
        ];
      } else {
        return [
          'edit',
          'pin',
          //'translate',
          'share',
          'follow',
          'feature',
          'delete',
          'report',
          'set-explicit',
          'block',
          'rating',
          'allow-comments',
        ];
      }
    } else {
      return [
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
      ];
    }
  }

  async onOptionSelected(option) {
    switch (option) {
      case 'edit':
        if (this.features.has('activity-composer')) {
          // check if entity is a blog.
          if (this.features.has('composer-blogs') && this.entity.blurb) {
            this.composer.contentType$.next('blog');
            this.blogsService.load(this.entity);
          } else {
            this.composer.load(this.entity);
          }

          this.composerModal
            .setInjector(this.injector)
            .present()
            .toPromise()
            .then(activity => {
              if (activity) {
                this.service.setEntity(activity);
              }
            });
        } else {
          // Load old post in editing mode
          this.router.navigate([`/newsfeed/${this.entity.guid}`], {
            queryParams: { editing: 1 },
          });
        }
        break;
      case 'delete':
        try {
          await this.client.delete(`api/v1/newsfeed/${this.entity.guid}`);
          this.deleted.emit();
        } catch (e) {
          console.error(e);
        }
        break;
    }
  }
}
