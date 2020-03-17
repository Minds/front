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
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ProService } from '../../../pro/pro.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'm-settingsV2Pro__hashtags',
  templateUrl: './hashtags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ProHashtagsComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  proSettingsSubscription: Subscription;
  protected paramMap$: Subscription;
  user: string | null = null;

  form;

  isActive: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected proService: ProService,
    private dialogService: DialogService,
    protected router: Router,
    protected route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      // footer: this.fb.group({
      //   title: [""],
      //   links: this.fb.array([])
      // })
      // footer_text: new FormControl([''])
      // footer_links: new FormArray([]),
      hashtags: new FormArray([]),
    });

    this.route.parent.params.subscribe(params => {
      if (this.session.isAdmin()) {
        this.user = params.user || null;
      }
    });

    this.proSettingsSubscription = this.proService.proSettings$.subscribe(
      (settings: any) => {
        this.isActive = settings.is_active;
        this.setTags(settings.tag_list);
        // this.footer_text.setValue(settings.footer_text);
        // this.setFooterLinks(settings.footer_links);

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
    this.form.markAsDirty();
    this.detectChanges();
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

  get hashtags() {
    return this.form.get('hashtags');
  }
  // get footer_links() {
  //   return this.form.get('footer_links');
  // }
  // get footer_text() {
  //   return this.form.get('footer_text');
  // }
}
