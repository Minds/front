import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import { PlusService } from '../../../plus/plus.service';
import { PlusVerifyModalLazyService } from '../../../plus/verify-modal/verify-modal-lazy.service';

/**
 * Settings form for verifying your Minds+ account
 */
@Component({
  selector: 'm-settingsV2Plus__verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2PlusVerifyComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  user: string | null = null;
  error: string = '';

  isVerified: boolean = false;
  isActive: boolean = true;
  hasSubscription: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected plusService: PlusService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected toasterService: ToasterService,
    protected verifyModal: PlusVerifyModalLazyService
  ) {}

  ngOnInit() {
    if (!this.plusService.isActive()) {
      this.isActive = false;
    }
    const user = this.session.getLoggedInUser();

    if (user?.verified) {
      this.isVerified = true;
    }
    this.detectChanges();
  }

  openVerifyModal() {
    this.verifyModal.open();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
