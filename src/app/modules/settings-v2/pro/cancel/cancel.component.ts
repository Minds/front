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
import { FormToastService } from '../../../../common/services/form-toast.service';

@Component({
  selector: 'm-settingsV2Pro__cancel',
  templateUrl: './cancel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProCancelComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  proSettingsSubscription: Subscription;
  protected paramMap$: Subscription;
  user: string | null = null;
  error: string = '';

  isActive: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected proService: ProService,
    private dialogService: DialogService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected formToastService: FormToastService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      if (this.session.isAdmin()) {
        this.user = params.user || null;
      }
    });

    this.proSettingsSubscription = this.proService.proSettings$.subscribe(
      (settings: any) => {
        this.isActive = settings.is_active;
        this.detectChanges();
      }
    );

    this.init = true;
    this.detectChanges();
  }

  async cancelSubscription() {
    this.dialogService.confirm(
      'Are you sure you want to cancel your Pro subscription?'
    );
    this.error = null;
    try {
      await this.proService.disable();
      this.router.navigate(['/', this.session.getLoggedInUser().name]);
    } catch (e) {
      this.error = e.message;
      this.formToastService.error('Error: ' + this.error);
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.proSettingsSubscription) {
      this.proSettingsSubscription.unsubscribe();
    }
  }
}
