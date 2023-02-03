import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Observable, Subscription, Subject } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ProService } from '../../../pro/pro.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Pro settings domain form
 */
@Component({
  selector: 'm-settingsV2Pro__domain',
  templateUrl: './domain.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProDomainComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  proSettingsSubscription: Subscription;
  protected paramMap$: Subscription;
  user: string | null = null;

  form;
  isDomainValid: boolean | null = null;
  error: string = '';
  domainValidationSubject: Subject<any> = new Subject<any>();

  isActive: boolean = false;

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
    this.form = new UntypedFormGroup({
      domain: new UntypedFormControl(
        '',
        [Validators.required],
        [this.validateDomain.bind(this)]
      ),
      custom_head: new UntypedFormControl(''),
    });

    this.route.parent.params.subscribe(params => {
      if (this.session.isAdmin()) {
        this.user = params.user || null;
      }
    });

    this.proSettingsSubscription = this.proService.proSettings$.subscribe(
      (settings: any) => {
        this.isActive = settings.is_active;

        if (!this.isActive) {
          // Non-actives have no domain control
          this.domain.setValidators([]);
          this.domain.disable();
        }
        this.domain.setValue(settings.domain);
        this.custom_head.setValue(settings.custom_head);
        this.detectChanges();
      }
    );

    this.init = true;
    this.detectChanges();
  }

  async submit() {
    if (!this.canSubmit()) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      const response: any = await this.proService.set(
        this.form.value,
        this.user
      );

      this.formSubmitted.emit({ formSubmitted: true });
      this.form.markAsPristine();
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  async validateDomain(control: AbstractControl) {
    this.isDomainValid = null;
    this.detectChanges();

    try {
      const { isValid } = await this.proService.domainCheck(
        control.value,
        this.user
      );

      this.isDomainValid = isValid;
    } catch (e) {
      this.isDomainValid = null;
      this.error = (e && e.message) || 'Error checking domain';
      this.toasterService.error(this.error);
    }

    if (!this.isDomainValid) {
      return {
        invalidDomain: true,
      };
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.pristine) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  canSubmit(): boolean {
    return !this.inProgress && this.form.valid && !this.form.pristine;
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

  get domain() {
    return this.form.get('domain');
  }
  get custom_head() {
    return this.form.get('custom_head');
  }
}
