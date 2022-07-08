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
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Pro settings form for theme colors
 */
@Component({
  selector: 'm-settingsV2Pro__theme',
  templateUrl: './theme.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProThemeComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  proSettingsSubscription: Subscription;
  isActive: boolean = false;
  user: string | null;

  textColorPickerVal: string;
  primaryColorPickerVal: string;
  plainBgColorPickerVal: string;

  hexPattern = '^#([0-9A-Fa-f]{6})$'; // accepts 6-digit codes only, hash required

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
    this.form = new FormGroup({
      text_color: new FormControl(''),
      text_color_picker: new FormControl(''),
      primary_color: new FormControl(''),
      primary_color_picker: new FormControl(''),
      plain_background_color: new FormControl(''),
      plain_background_color_picker: new FormControl(''),
      scheme: new FormControl(''),
      tile_ratio: new FormControl(''),
    });

    this.route.parent.params.subscribe(params => {
      if (this.session.isAdmin()) {
        this.user = params.user || null;
      }
    });

    this.proSettingsSubscription = this.proService.proSettings$.subscribe(
      (settings: any) => {
        this.isActive = settings.is_active;
        this.text_color.setValue(settings.text_color);
        this.text_color_picker.setValue(settings.text_color);
        this.primary_color.setValue(settings.primary_color);
        this.primary_color_picker.setValue(settings.primary_color);
        this.plain_background_color.setValue(settings.plain_background_color);
        this.plain_background_color_picker.setValue(
          settings.plain_background_color
        );
        this.scheme.setValue(settings.scheme);
        this.tile_ratio.setValue(settings.tile_ratio);
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

  updateColorText(colorTextControl, updatedColor) {
    if (updatedColor !== this.form.value[colorTextControl]) {
      this.form.get(colorTextControl).setValue(updatedColor);
    }
  }

  updateColorPicker(colorTextControlName, updatedColor) {
    const colorTextControl = this.form.get(colorTextControlName);
    const colorPickerControl = this.form.get(`${colorTextControlName}_picker`);
    if (
      colorTextControl.valid &&
      colorTextControl.value !== colorPickerControl.value
    ) {
      colorPickerControl.setValue(updatedColor);
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
  get ratios() {
    return this.proService.ratios;
  }

  get text_color() {
    return this.form.get('text_color');
  }

  get text_color_picker() {
    return this.form.get('text_color_picker');
  }

  get primary_color() {
    return this.form.get('primary_color');
  }

  get primary_color_picker() {
    return this.form.get('primary_color_picker');
  }

  get plain_background_color() {
    return this.form.get('plain_background_color');
  }

  get plain_background_color_picker() {
    return this.form.get('plain_background_color_picker');
  }

  get scheme() {
    return this.form.get('scheme');
  }

  get tile_ratio() {
    return this.form.get('tile_ratio');
  }
}
