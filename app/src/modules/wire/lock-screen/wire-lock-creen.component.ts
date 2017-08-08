import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit,
  Output
} from '@angular/core';
import { Client } from '../../../services/api/client';

@Component({
  moduleId: module.id,
  selector: 'm-wire--lock-screen',
  templateUrl: 'wire-lock-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireLockScreenComponent implements AfterViewInit {
  @Input() entity: any;
  @Output('entityChange') update: EventEmitter<any> = new EventEmitter<any>();

  constructor(private client: Client, private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.client.get('api/v1/wire/threshold/' + this.entity.guid)
      .then((response: any) => {
        if (response.hasOwnProperty('activity')) {
          this.update.next(response.activity);
          this.detectChanges();
        }
      })
      .catch(e => console.error('got error: ', e));
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}