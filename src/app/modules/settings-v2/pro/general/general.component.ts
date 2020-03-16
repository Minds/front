import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ProService } from '../../../pro/pro.service';
import { Router } from '@angular/router';

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

  form;
  formValsChanged: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected proService: ProService,
    private dialogService: DialogService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required],
      }),
      headline: new FormControl(''),
      published: new FormControl(''),
    });

    this.form.valueChanges.subscribe(val => {
      this.formValsChanged = true;
      console.log('valschanged', val);
    });

    this.proSettingsSubscription = this.proService.proSettings$.subscribe(
      (settings: any) => {
        this.isActive = settings.is_active;
        this.title.setValue(settings.title);
        this.headline.setValue(settings.headline);
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

      const response: any = await this.proService.set(this.form.value);
      if (response.status === 'success') {
        this.formSubmitted.emit({ formSubmitted: true });
        this.form.markAsPristine();
      }
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.pristine || !this.formValsChanged) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  canSubmit(): boolean {
    return !this.inProgress && this.form.valid && this.formValsChanged;
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

  get published() {
    return this.form.get('published');
  }
}
