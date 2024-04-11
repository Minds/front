import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ElementRef,
  ViewChild,
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
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

/**
 * Pro settings form for logo and background images
 */
@Component({
  selector: 'm-settingsV2Pro__assets',
  templateUrl: './assets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProAssetsComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  @ViewChild('logoField')
  protected logoField: ElementRef<HTMLInputElement>;

  @ViewChild('backgroundField')
  protected backgroundField: ElementRef<HTMLInputElement>;

  init: boolean = false;
  inProgress: boolean = false;
  proSettingsSubscription: Subscription;
  protected paramMap$: Subscription;
  user: string | null = null;
  bgImageSelected: boolean = false;
  settings: any;
  assetUploaded: boolean = false;

  form;

  isActive: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected proService: ProService,
    private dialogService: DialogService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({
      logo: new UntypedFormControl(''),
      background: new UntypedFormControl(''),
    });

    this.route.parent.params.subscribe((params) => {
      if (this.session.isAdmin()) {
        this.user = params.user || null;
      }
    });

    this.proSettingsSubscription = this.proService.proSettings$.subscribe(
      (settings: any) => {
        this.settings = settings;
        this.isActive = settings.is_active;
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

      const { logo, background, ...settings } = this.settings;

      const uploads: Promise<any>[] = [];

      if (logo) {
        uploads.push(this.uploadAsset('logo', logo, this.logoField));
        settings.has_custom_logo = true;
      }

      if (background) {
        uploads.push(
          this.uploadAsset('background', background, this.backgroundField)
        );
        settings.has_custom_background = true;
      }

      uploads.push(
        this.proService.set(
          {
            has_custom_logo: settings.has_custom_logo,
            has_custom_background: settings.has_custom_background,
          },
          this.user
        )
      );

      await Promise.all(uploads);

      this.formSubmitted.emit({ formSubmitted: true });
      this.form.markAsPristine();
      this.assetUploaded = false;
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  protected async uploadAsset(
    type: string,
    file: File,
    htmlInputFileElementRef: ElementRef<HTMLInputElement> | null = null
  ): Promise<void> {
    await this.proService.upload(type, file, this.user);

    if (htmlInputFileElementRef && htmlInputFileElementRef.nativeElement) {
      try {
        htmlInputFileElementRef.nativeElement.value = '';
        this.assetUploaded = true;
      } catch (e) {
        console.warn(`Browser prevented ${type} field resetting`);
      }
    }
  }

  onAssetFileSelect(type: string, files: FileList | null) {
    if (!files || !files.item(0)) {
      this.settings[type] = null;
      this.detectChanges();
      return;
    }

    this.settings[type] = files.item(0);
    this.bgImageSelected = true;
    this.form.markAsDirty();
    this.detectChanges();
  }

  getPreviewAssetSrc(type: string): string | SafeUrl {
    if (this.settings[type]) {
      if (!this.settings[type]._mindsBlobUrl) {
        this.settings[type]._mindsBlobUrl = URL.createObjectURL(
          this.settings[type] as File
        );
      }
      if (type === 'background') {
        this.bgImageSelected = true;
      }

      return this.sanitizer.bypassSecurityTrustUrl(
        this.settings[type]._mindsBlobUrl
      );
    }

    return this.settings[`${type}_image`] + '?cb=' + Date.now();
  }

  showFilePreviewOverlay() {
    return !this.settings.has_custom_background && !this.bgImageSelected;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.assetUploaded) {
      return true;
    }

    return this.dialogService.confirm('Discard assets?');
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

  get logo() {
    return this.form.get('logo');
  }
  get background() {
    return this.form.get('background');
  }
}
