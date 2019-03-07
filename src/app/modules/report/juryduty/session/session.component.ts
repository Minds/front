import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { REASONS } from '../../../../services/list-options';

@Component({
  selector: 'm-juryduty__session',
  templateUrl: 'session.component.html'
})

export class JuryDutySessionComponent implements AfterViewInit {

    constructor() {

    }

    ngOnInit() {
        
    }

    ngAfterViewInit() {

    }

}