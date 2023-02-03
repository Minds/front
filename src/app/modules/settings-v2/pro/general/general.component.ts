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
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ProService } from '../../../pro/pro.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Pro settings form for pro site title and headline.
 * Includes checkbox for enabling/disabling splash page.
 */
@Component({
  selector: 'm-settingsV2Pro__general',
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProGeneralComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  proSettingsSubscription: Subscription;
  isActive: boolean = false;
  user: string | null;

  form;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected proService: ProService,
    private dialogService: DialogService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({
      title: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
      headline: new UntypedFormControl(''),
      splash: new UntypedFormControl(''),
      published: new UntypedFormControl(''),
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
          this.published.disable();
        }

        this.title.setValue(settings.title);
        this.headline.setValue(settings.headline);
        this.splash.setValue(settings.splash);
        this.published.setValue(settings.published);
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
      this.formSubmitted.emit({
        formSubmitted: false,
        error: e.message || 'An unknown error has occurred',
      });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.canSubmit()) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  canSubmit(): boolean {
    return !this.inProgress && this.form.valid && !this.form.pristine;
  }

  onEnableProThemeClick(e: MouseEvent): void {
    if (!this.isActive) {
      this.router.navigate(['/pro']);
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

  get title() {
    return this.form.get('title');
  }

  get headline() {
    return this.form.get('headline');
  }

  get splash() {
    return this.form.get('splash');
  }

  get published() {
    return this.form.get('published');
  }
}
