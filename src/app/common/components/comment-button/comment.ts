import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';

import { Client } from '../../../services/api';
import { ActivityService } from '../../../common/services/activity.service';

@Component({
  selector: 'minds-button-comment',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: 'comment.html',
})
export class CommentButton implements OnInit, OnDestroy {
  object;
  @Input() iconOnly = false;

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
