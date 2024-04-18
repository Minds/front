import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import * as moment from 'moment';
import { PlusService } from '../../../plus/plus.service';

/**
 * Settings form cancelling Plus subscription
 */
@Component({
  selector: 'm-settingsV2Plus__cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2PlusCancelComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  protected paramMap$: Subscription;
  user: string | null = null;
  error: string = '';
  isActive: boolean = true;
  hasSubscription: boolean = false;
  canBeCancelled: boolean = false;
  expires: number = 0;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected plusService: PlusService,
    private dialogService: DialogService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe((params) => {
      if (this.session.isAdmin()) {
        this.user = params.user || null;
      }
    });

    this.load();
    this.detectChanges();
  }

  async load() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      this.isActive = await this.plusService.isActive();
      this.hasSubscription = await this.plusService.hasSubscription();
      this.canBeCancelled = await this.plusService.canBeCancelled();
      this.expires = await this.plusService.expires();
    } catch (e) {
      this.error = (e && e.message) || 'Unknown error';
      this.toasterService.error('Error: ' + this.error);
    }

    this.inProgress = false;
    this.init = true;

    this.detectChanges();
  }

  async cancelSubscription(): Promise<void> {
    if (!this.isActive || (this.isActive && !this.hasSubscription)) {
      return;
    }

    this.confirmCancellation().subscribe(async (confirmed) => {
      if (!confirmed) {
        return;
      }

      this.error = null;
      try {
        await this.plusService.disable();
        this.toasterService.success(
          'You have successfully canceled your Minds+ subscription.'
        );
        this.router.navigate(['/', this.session.getLoggedInUser().username]);
      } catch (e) {
        this.error = e.message;
        this.toasterService.error('Error: ' + this.error);
      }
    });
  }

  private confirmCancellation(): Observable<boolean> {
    return this.dialogService.confirm(
      'Are you sure you want to cancel your Minds+ subscription?'
    );
  }

  get expiryString(): string {
    if (this.expires * 1000 <= Date.now()) {
      return '';
    }

    return moment(this.expires * 1000)
      .local()
      .format('h:mma [on] MMM Do, YYYY');
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
