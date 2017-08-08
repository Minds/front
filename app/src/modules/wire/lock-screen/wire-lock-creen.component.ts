import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit,
  Output
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wire--lock-screen',
  templateUrl: 'wire-lock-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireLockScreenComponent implements AfterViewInit {

  @Input() entity: any;
  @Output('entityChange') update: EventEmitter<any> = new EventEmitter<any>();

  inProgress: boolean = false;

  constructor(private client: Client, public session: Session, private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
  }

  unlock() {
    this.inProgress = true;
    this.detectChanges();

    this.client.get('api/v1/wire/threshold/' + this.entity.guid)
      .then((response: any) => {
        if (response.paywall) {
          alert('You must send a wire first');
        }
        if (response.hasOwnProperty('activity')) {
          this.update.next(response.activity);
          this.detectChanges();
        }
        this.inProgress = false;
        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.detectChanges();
        console.error('got error: ', e);
      });
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
