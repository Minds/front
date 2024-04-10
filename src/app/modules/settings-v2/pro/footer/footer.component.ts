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
  UntypedFormArray,
  UntypedFormBuilder,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ProService } from '../../../pro/pro.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Pro settings form for managing footer links
 */
@Component({
  selector: 'm-settingsV2Pro__footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProFooterComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  proSettingsSubscription: Subscription;
  protected paramMap$: Subscription;
  user: string | null = null;
  currentFooterText = '';

  currentFooterLinks = [];
  formValsChanged: boolean = false;

  form;

  isActive: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected proService: ProService,
    private dialogService: DialogService,
    protected router: Router,
    protected route: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({
      footer_text: new UntypedFormControl(['']),
      footer_links: new UntypedFormArray([]),
    });

    /**
     * Manually compare the form values before + after changes
     * are made, to determine whether the form is saveable
     * and also whether to display a 'discard changes?' popup
     */
    this.form.valueChanges.subscribe(() => {
      if (this.init) {
        const nonBlankLinks = this.footer_links.value.filter((item) => {
          return item.title || item.href;
        });

        const linksChanged =
          JSON.stringify(this.currentFooterLinks) !==
          JSON.stringify(nonBlankLinks);

        const textChanged = this.footer_text.value !== this.currentFooterText;

        this.formValsChanged = textChanged || linksChanged;
      }
    });

    this.route.parent.params.subscribe((params) => {
      if (this.session.isAdmin()) {
        this.user = params.user || null;
      }
    });

    this.proSettingsSubscription = this.proService.proSettings$.subscribe(
      (settings: any) => {
        this.isActive = settings.is_active;

        this.currentFooterText = settings.footer_text;
        this.currentFooterLinks = settings.footer_links;

        this.footer_text.setValue(settings.footer_text);
        this.setFooterLinks(settings.footer_links);
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

  addBlankFooterLink() {
    this.addFooterLink('', '');
  }

  addFooterLink(title, href) {
    const links = <UntypedFormArray>this.footer_links;
    links.push(
      this.fb.group({
        title: [title],
        href: [href],
      })
    );
  }

  setFooterLinks(links: Array<{ title: string; href: string }>) {
    (<UntypedFormArray>this.footer_links).clear();
    this.detectChanges();
    for (const link of links) {
      this.addFooterLink(link.title, link.href);
    }
    this.detectChanges();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.formValsChanged) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  canSubmit(): boolean {
    return !this.inProgress && this.form.valid && this.formValsChanged;
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

  get footer_links() {
    return this.form.get('footer_links');
  }
  get footer_text() {
    return this.form.get('footer_text');
  }
}
