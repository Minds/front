import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Subject, Subscription, from } from 'rxjs';
import { ProService } from '../pro.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MindsTitle } from '../../../services/ux/title';
import { SiteService } from '../../../common/services/site.service';
import { debounceTime } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormToastService } from '../../../common/services/form-toast.service';
import {
  NgForm,
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'm-proSettings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'settings.component.html',
})
export class ProSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  activeForm: NgForm;
  activeTab: any;
  tabs = [
    {
      id: 'general',
      title: 'General',
      subtitle: 'Customize your title and headline',
    },
    {
      id: 'theme',
      title: 'Theme',
      subtitle: "Set up your site's color theme",
    },
    {
      id: 'assets',
      title: 'Assets',
      subtitle: 'Upload custom logo and background images',
    },
    {
      id: 'hashtags',
      title: 'Hashtags',
      subtitle: 'Set up your category filter hashtags here',
    },
    {
      id: 'footer',
      title: 'Footer',
      subtitle: "Set up your site's footer links",
    },
    {
      id: 'domain',
      title: 'Domain',
      subtitle: 'Customize your site domain',
    },
  ];

  settings: any;

  init: boolean = false;

  inProgress: boolean;

  saved: boolean = false;

  user: string | null = null;

  isDomainValid: boolean | null = null;

  error: string;

  hexPattern = '^#?([0-9A-Fa-f]{3}){1,2}$'; // accepts both 3- and 6-digit codes, hash is optional

  domainValidationSubject: Subject<any> = new Subject<any>();

  protected paramMap$: Subscription;

  protected param$: Subscription;

  protected domainValidation$: Subscription;

  @ViewChild('logoField', { static: false })
  protected logoField: ElementRef<HTMLInputElement>;

  @ViewChild('backgroundField', { static: false })
  protected backgroundField: ElementRef<HTMLInputElement>;

  form = this.fb.group({
    title: ['', Validators.required],
    headline: [''],
    published: [''],
    theme: this.fb.group({
      text_color: [''],
      primary_color: [''],
      plain_background_color: [''],
      scheme: [''],
      tile_ratio: [''],
    }),
    hashtags: this.fb.array([]),
    assets: this.fb.group({
      logo: [''],
      background: [''],
    }),
    footer: this.fb.group({
      title: [''],
      links: this.fb.array([]),
    }),
    domain: this.fb.group({
      domain: ['', Validators.required, this.validateDomain.bind(this)],
      custom_head: [''],
    }),
  });

  constructor(
    protected service: ProService,
    protected session: Session,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    protected title: MindsTitle,
    protected site: SiteService,
    protected sanitizer: DomSanitizer,
    private formToastService: FormToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.paramMap$ = this.route.paramMap.subscribe((params: ParamMap) => {
      const activeTabParam = params.get('tab');
      this.activeTab = this.tabs.find(tab => tab.id === activeTabParam);
      this.activeTab['saveStatus'] = 'unsaved';
      if (this.init) {
        this.detectChanges();
      }
    });

    this.param$ = this.route.params.subscribe(params => {
      if (this.session.isAdmin()) {
        this.user = params['user'] || null;
      }

      this.load();
    });
  }

  ngAfterViewInit() {
    this.init = true;
    this.detectChanges();
  }

  ngOnDestroy() {
    this.paramMap$.unsubscribe();
    this.param$.unsubscribe();
    // this.domainValidation$.unsubscribe();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    const { isActive, settings } = await this.service.get(this.user);

    if (!isActive && !this.user) {
      this.router.navigate(['/pro'], { replaceUrl: true });
      return;
    }

    this.form.patchValue({
      title: settings.title,
      headline: settings.headline,
      published: settings.published,
      theme: {
        text_color: settings.text_color,
        primary_color: settings.primary_color,
        plain_background_color: settings.plain_background_color,
        scheme: settings.scheme,
        tile_ratio: settings.tile_ratio,
      },
      footer: {
        title: settings.footer_text,
      },
      domain: {
        domain: settings.domain,
        custom_head: settings.custom_head,
      },
    });

    (<FormArray>this.form.controls.hashtags).clear();
    (<FormArray>(<FormGroup>this.form.controls.footer).controls.links).clear();

    for (let tag of settings.tag_list) {
      this.addTag(tag.label, tag.tag);
    }

    for (let link of settings.footer_links) {
      this.addFooterLink(link.title, link.href);
    }

    this.settings = settings;

    this.title.setTitle('Pro Settings');

    this.inProgress = false;
    this.detectChanges();
  }

  async validateDomain(control: AbstractControl) {
    this.isDomainValid = null;
    this.detectChanges();

    try {
      const { isValid } = await this.service.domainCheck(
        control.value,
        this.user
      );

      this.isDomainValid = isValid;
    } catch (e) {
      this.isDomainValid = null;
      this.error = (e && e.message) || 'Error checking domain';
      this.formToastService.error(this.error);
    }

    if (!this.isDomainValid) {
      return {
        invalidDomain: true,
      };
    }
  }

  onAssetFileSelect(type: string, files: FileList | null) {
    if (!files || !files.item(0)) {
      this.settings[type] = null;
      this.detectChanges();
      return;
    }

    this.settings[type] = files.item(0);
    this.detectChanges();
  }

  protected async uploadAsset(
    type: string,
    file: File,
    htmlInputFileElementRef: ElementRef<HTMLInputElement> | null = null
  ): Promise<void> {
    await this.service.upload(type, file, this.user);

    if (htmlInputFileElementRef && htmlInputFileElementRef.nativeElement) {
      try {
        htmlInputFileElementRef.nativeElement.value = '';
      } catch (e) {
        console.warn(`Browser prevented ${type} field resetting`);
      }
    }
  }

  getPreviewAssetSrc(type: string): string | SafeUrl {
    if (this.settings[type]) {
      if (!this.settings[type]._mindsBlobUrl) {
        this.settings[type]._mindsBlobUrl = URL.createObjectURL(
          this.settings[type] as File
        );
      }

      return this.sanitizer.bypassSecurityTrustUrl(
        this.settings[type]._mindsBlobUrl
      );
    }

    return this.settings[`${type}_image`];
  }

  async onSubmit() {
    console.log(this.form);
    console.log(this.form.value);
    this.error = null;
    this.activeTab.saveStatus = 'saving';
    this.detectChanges();

    await this.save();
  }

  async save() {
    this.error = null;
    this.inProgress = true;
    this.detectChanges();

    try {
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

      await Promise.all(uploads);

      this.settings = {
        ...settings,
        title: this.form.value.title,
        headline: this.form.value.headline,
        published: this.form.value.published,
        text_color: this.form.value.theme.text_color,
        primary_color: this.form.value.theme.primary_color,
        primary_background_color: this.form.value.theme
          .primary_background_color,
        scheme: this.form.value.theme.scheme,
        tile_ratio: this.form.value.theme.tile_ratio,
        domain: this.form.value.domain.domain,
        custom_head: this.form.value.domain.custom_head,
        footer_text: this.form.value.footer.title,
        tag_list: this.form.value.hashtags,
        footer_links: this.form.value.footer.links,
      };
      await this.service.set(this.settings, this.user);
      this.formToastService.success(
        'Pro settings have been successfully updated'
      );
      this.activeTab.saveStatus = 'saved';
    } catch (e) {
      this.error = e.message;
      this.formToastService.error('Error: ' + this.error);
      this.activeTab.saveStatus = 'unsaved';
    }

    this.saved = true;
    this.inProgress = false;
    this.detectChanges();
  }

  addBlankTag() {
    this.addTag('', '');
  }

  addTag(label, tag) {
    const hashtags = <FormArray>this.form.controls.hashtags;
    hashtags.push(
      this.fb.group({
        label: [label],
        tag: [tag],
      })
    );
  }

  removeTag(index: number) {
    console.log('removing tag', index);
    const hashtags = <FormArray>this.form.controls.hashtags;
    hashtags.removeAt(index);
  }

  addBlankFooterLink() {
    this.addFooterLink('', '');
  }

  addFooterLink(title, href) {
    const footer = <FormGroup>this.form.controls.footer;
    const links = <FormArray>footer.controls.links;
    links.push(
      this.fb.group({
        title: [title],
        href: [href],
      })
    );
  }

  // removeFooterLink(index: number) {
  //   this.settings.footer_links.splice(index, 1);
  // }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get previewRoute() {
    return ['/pro', this.user || this.session.getLoggedInUser().username];
  }

  get ratios() {
    return this.service.ratios;
  }

  get isRemote() {
    return Boolean(this.user);
  }

  get isAdmin() {
    return this.session.isAdmin();
  }
}
