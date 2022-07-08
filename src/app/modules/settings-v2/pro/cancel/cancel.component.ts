import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ProService } from '../../../pro/pro.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import * as moment from 'moment';

@Component({
  selector: 'm-settingsV2Pro__cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProCancelComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  protected paramMap$: Subscription;
  user: string | null = null;
  error: string = '';

  isActive: boolean = false;
  hasSubscription: boolean = false;
  expires: number = 0;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected proService: ProService,
    private dialogService: DialogService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
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
      this.isActive = await this.proService.isActive();
      this.hasSubscription = await this.proService.hasSubscription();
      this.expires = await this.proService.expires();
    } catch (e) {
      this.error = (e && e.message) || 'Unknown error';
      this.toasterService.error('Error: ' + this.error);
    }

    this.inProgress = false;
    this.init = true;

    this.detectChanges();
  }

  async cancelSubscription() {
    if (!this.isActive || (this.isActive && !this.hasSubscription)) {
      return;
    }
    this.dialogService.confirm(
      'Are you sure you want to cancel your Pro subscription?'
    );
    this.error = null;
    try {
      await this.proService.disable();
      this.toasterService.success(
        'You have successfully canceled your Minds Pro subscription.'
      );
      this.router.navigate(['/', this.session.getLoggedInUser().username]);
    } catch (e) {
      this.error = e.message;
      this.toasterService.error('Error: ' + this.error);
    }
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
