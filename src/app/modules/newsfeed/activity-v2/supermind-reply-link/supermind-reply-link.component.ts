import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ActivityService } from '../../activity/activity.service';

@Component({
  selector: 'm-activityV2__supermindReplyLink',
  templateUrl: './supermind-reply-link.component.html',
  styleUrls: ['./supermind-reply-link.component.ng.scss'],
})
export class ActivityV2SupermindReplyLinkComponent
  extends AbstractSubscriberComponent
  implements OnInit {
  subscriptions: Subscription[] = [];

  isSupermindRequest: boolean;
  supermindReplyGuid: string;

  constructor(public service: ActivityService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.entity$.subscribe(entity => {
        this.isSupermindRequest =
          entity.supermind && !entity.supermind.is_reply;

        if (this.isSupermindRequest && entity.supermind.reply_guid) {
          this.supermindReplyGuid = entity.supermind;
        }
      })
    );
  }
}
