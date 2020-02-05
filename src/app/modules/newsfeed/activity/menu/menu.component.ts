import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import { ActivityService, ActivityEntity } from '../activity.service';

@Component({
  selector: 'm-activity__menu',
  templateUrl: 'menu.component.html',
})
export class ActivityMenuComponent {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(public service: ActivityService, private router: Router) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
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
