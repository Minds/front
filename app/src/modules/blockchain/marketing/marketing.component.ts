import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import {
  Router,
} from '@angular/router';

import { Client } from '../../../services/api/client';
import { MindsTitle } from '../../../services/ux/title';
import { WireCreatorComponent } from '../../wire/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainMarketingComponent implements OnInit, OnDestroy {

  minds = window.Minds;

  videoError: boolean = false;
  countDown$: Observable<string>;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected title: MindsTitle,
    protected overlayModal: OverlayModalService,
    public session: Session,
    protected router: Router,
  ) { }

  ngOnInit() {
    this.title.setTitle('The Minds Token');

    if (document && document.body) {
      document.body.classList.add('m-blockchain--splash');
    }
    this.runCountDown();
  }

  ngOnDestroy() {
    if (document && document.body) {
      document.body.classList.remove('m-overlay-modal--splash');
    }
  }

  runCountDown() {
    this.countDown$ = Observable
                    .interval(1000)
                    .map(i => {
                      const countDownDate = new Date("March 28, 2018 05:00:00").getTime()
                      // Get todays date and time
                      const now = new Date().getTime();

                      // Find the distance between now an the count down date
                      var distance = countDownDate - now;

                      // Time calculations for days, hours, minutes and seconds
                      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                      return days + ' days ' + hours + ' hours ' + minutes + ' minutes ' +  seconds + ' seconds';
                    });
  }

  downloadWhitepaper() {
    alert('coming soon');	
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * When the video source's got an error
   */
  onSourceError() {
    this.videoError = true;
  }
}
