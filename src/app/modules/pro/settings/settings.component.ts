import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
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
import sidebarMenu from './sidebar-menu.default';
import { Menu } from '../../../common/components/sidebar-menu/sidebar-menu.component';
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
export class ProSettingsComponent implements OnInit, OnDestroy {
  menuObj: Menu = sidebarMenu;
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
    {
      id: 'payouts',
      title: 'Payouts',
      subtitle:
        'Select the currency type you wish you be paid out in. Please note payouts only occur once you have received the equivalent of $100 or greater.',
    },
  ];

  settings: any;

  inProgress: boolean;

  saved: boolean = false;

  saveStatus: string = 'unsaved';

  user: string | null = null;

  isDomainValid: boolean | null = null;

  error: string;

  hexPattern = '^#([0-9A-Fa-f]{3}){1,2}$'; // accepts both 3- and 6-digit codes, hash required

  domainValidationSubject: Subject<any> = new Subject<any>();

  protected paramMap$: Subscription;

  protected formChanges$: Subscription;

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
    payouts: this.fb.group({
      method: ['usd'],
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
      this.saveStatus = 'unsaved';

      if (this.session.isAdmin()) {
        this.user = params.get('username') || null;
        this.updatePreviewRoute();
      }

      this.detectChanges();
      this.load();
    });

    this.formChanges$ = this.form.valueChanges.subscribe((value: any) => {
      if (this.form.dirty && this.saveStatus === 'saved') {
        this.saveStatus = 'unsaved';
        this.detectChanges();
      }
    });
  }

  updatePreviewRoute() {
    const previewRouteLink = this.menuObj.links.find(
      link => link.id === ':user'
    );
    if (previewRouteLink) {
      previewRouteLink.path = `pro/${this.user}`;
      this.detectChanges();
    }
  }

  ngOnDestroy() {
    this.paramMap$.unsubscribe();
    this.formChanges$.unsubscribe();
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
      payouts: {
        method: settings.payout_method,
      },
    });

    this.setTags(settings.tag_list);
    this.setFooterLinks(settings.footer_links);

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

    return this.settings[`${type}_image`] + '?cb=' + Date.now();
  }

  async onSubmit() {
    this.error = null;
    this.saveStatus = 'saving';
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
        payout_method: this.form.value.payouts.method,
      };
      await this.service.set(this.settings, this.user);
      this.formToastService.success(
        'Pro settings have been successfully updated'
      );
      this.saveStatus = 'saved';
      this.form.markAsPristine();
    } catch (e) {
      this.error = e.message;
      this.formToastService.error('Error: ' + this.error);
      this.saveStatus = 'unsaved';
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

  setTags(tags: Array<{ label: string; tag: string }>) {
    (<FormArray>this.form.controls.hashtags).clear();
    this.detectChanges();
    for (const tag of tags) {
      this.addTag(tag.label, tag.tag);
    }
    this.detectChanges();
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

  setFooterLinks(links: Array<{ title: string; href: string }>) {
    (<FormArray>(<FormGroup>this.form.controls.footer).controls.links).clear();
    this.detectChanges();
    for (let link of links) {
      this.addFooterLink(link.title, link.href);
    }
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
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
