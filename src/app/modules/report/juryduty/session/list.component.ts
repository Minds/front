import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { REASONS } from '../../../../services/list-options';
import { JurySessionService } from './session.service';

@Component({
  selector: 'm-jurydutySession__list',
  templateUrl: 'list.component.html'
})

export class JuryDutySessionListComponent implements AfterViewInit {

  @Input() juryType = 'appeal';
  reports: Array<any> = [];

  constructor(
    private sessionService: JurySessionService,
  ) {

  }

  ngOnInit() {
    this.load();
  }

  async load(refresh: boolean = false) {
    let result: any = await this.sessionService.getList({
      juryType: this.juryType,
    });

    this.reports = result.reports;
  }

  ngAfterViewInit() {

  }

}