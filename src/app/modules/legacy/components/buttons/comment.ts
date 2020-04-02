import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Client } from '../../../../services/api';
import { ActivityService } from '../../../../common/services/activity.service';

@Component({
  selector: 'minds-button-comment',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <a [ngClass]="{ selected: object['comments:count'] > 0 }">
      <i
        class="material-icons"
        *ngIf="(activityService.allowComment$ | async) === true"
        >chat_bubble</i
      >
      <i
        class="material-icons"
        *ngIf="(activityService.allowComment$ | async) === false"
        title="Comments have been disabled for this post"
        i18n-title="@@COMMENTS__DISABLED"
      >
        speaker_notes_off
      </i>
      <span class="minds-counter" *ngIf="object['comments:count'] > 0">{{
        object['comments:count'] | number
      }}</span>
    </a>
  `,
})
export class CommentButton implements OnInit, OnDestroy {
  object;

  constructor(
    public client: Client,
    public activityService: ActivityService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  set _object(value: any) {
    this.object = value;
    this.activityService.allowComment$.next(this.object.allow_comments);
  }
}
