import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

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

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected title: MindsTitle,
    protected overlayModal: OverlayModalService,
    protected session: Session,
    protected router: Router,
  ) { }

  ngOnInit() {
    if (!this.session.isAdmin()) {
      return this.router.navigate(['/newsfeed']);
    }
    this.title.setTitle('The Minds Token');
  }

  ngOnDestroy() {

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
