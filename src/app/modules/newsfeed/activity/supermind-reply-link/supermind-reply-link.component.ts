import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ActivityService } from '../../activity/activity.service';

@Component({
  selector: 'm-activity__supermindReplyLink',
  templateUrl: './supermind-reply-link.component.html',
  styleUrls: ['./supermind-reply-link.component.ng.scss'],
})
export class ActivitySupermindReplyLinkComponent
  extends AbstractSubscriberComponent
  implements OnInit {
  subscriptions: Subscription[] = [];
  entity;

  supermindReplyGuid: string;

  constructor(public service: ActivityService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.entity$.subscribe(entity => {
        this.entity = entity;
      }),
      this.service.isSupermindRequestWithReply$.subscribe(is => {
        if (is && this.entity) {
          this.supermindReplyGuid = this.entity.supermind.reply_guid;
        }
      })
    );
  }
}
