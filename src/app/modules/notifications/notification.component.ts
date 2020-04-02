import { Component, Input } from '@angular/core';
import { Session } from '../../services/session';
import { Reason, rejectionReasons } from '../boost/rejection-reasons';
import { ConfigsService } from '../../common/services/configs.service';
import { TimeDiffService } from '../../services/timediff.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'minds-notification',
  templateUrl: 'notification.component.html',
})
export class NotificationComponent {
  readonly cdnUrl: string;
  notification: any;

  notificationAge$: Observable<number>;

  @Input() showElapsedTime: boolean = false;

  @Input('notification')
  set _notification(value: any) {
    this.notification = value;

    if (this.showElapsedTime) {
      this.notificationAge$ = this.timeDiffService.source.pipe(
        map(secondsElapsed => {
          return (this.notification.time_created - secondsElapsed) * 1000;
        })
      );
    }
  }

  constructor(
    public session: Session,
    private timeDiffService: TimeDiffService,
    private configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  openMessengerWindow(event) {
    if (event) {
      event.preventDefault();
    }

    (<any>window).openMessengerWindow();
  }

  findReason(code: number): Reason {
    return rejectionReasons.find((item: Reason) => {
      return item.code === code;
    });
  }
}
