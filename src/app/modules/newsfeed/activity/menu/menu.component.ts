import {
  Component,
  HostListener,
  ViewChild,
  Input,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService, ActivityEntity } from '../activity.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { MindsUser, MindsGroup } from '../../../../interfaces/entities';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../media/modal/modal.component';

@Component({
  selector: 'm-activity__menu',
  templateUrl: 'menu.component.html',
})
export class ActivityMenuComponent {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    private overlayModal: OverlayModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
      }
    );
  }

  ngOnDestory() {
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

  onOptionSelected(option): void {
    switch (option) {
      case 'edit':
        // Load old post in editing mode
        this.router.navigate([`/newsfeed/${this.entity.guid}`], {
          queryParams: { editing: 1 },
        });
        break;
    }
  }
}
