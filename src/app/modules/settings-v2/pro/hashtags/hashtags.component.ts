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
  UntypedFormArray,
  UntypedFormBuilder,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ProService } from '../../../pro/pro.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Pro settings form for setting up category filter hashtags
 */
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

  currentTags = [];
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
      tag_list: new UntypedFormArray([]),
    });

    /**
     * Manually compare the form values before + after changes
     * are made to determine whether the form is saveable
     * and also whether to display a 'discard changes?' popup
     */
    this.form.valueChanges.subscribe(() => {
      if (this.init) {
        // Disregard empty tags when evaluating changes
        const nonBlankTags = this.tag_list.value.filter(item => {
          return item.label || item.tag;
        });

        this.formValsChanged =
          JSON.stringify(this.currentTags) !== JSON.stringify(nonBlankTags);
      }
    });

    this.route.parent.params.subscribe(params => {
      if (this.session.isAdmin()) {
        this.user = params.user || null;
      }
    });

    this.proSettingsSubscription = this.proService.proSettings$.subscribe(
      (settings: any) => {
        this.isActive = settings.is_active;
        this.currentTags = settings.tag_list;
        this.setTags(settings.tag_list);

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

  addBlankTag() {
    this.addTag('', '');
  }

  addTag(tag, label) {
    const tag_list = <UntypedFormArray>this.tag_list;
    tag_list.push(
      this.fb.group({
        tag: [tag],
        label: [label],
      })
    );
  }

  setTags(tags: Array<{ label: string; tag: string }>) {
    (<UntypedFormArray>this.tag_list).clear();
    this.detectChanges();
    for (const tag of tags) {
      this.addTag(tag.tag, tag.label);
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

  get tag_list() {
    return this.form.get('tag_list');
  }
}
