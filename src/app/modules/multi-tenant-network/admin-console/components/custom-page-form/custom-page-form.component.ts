import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { urlValidator } from '../../../../forms/url.validator';
import { CustomPage } from '../../../../../../graphql/generated.engine';
import {
  CustomPageType,
  CustomPageImplementation,
  CustomPageExtended,
} from '../../../../custom-pages/custom-pages.types';
import {
  BehaviorSubject,
  Subscription,
  filter,
  lastValueFrom,
  take,
} from 'rxjs';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { CustomPageService } from '../../../services/custom-page.service';
import { ModalService } from '../../../../../services/ux/modal.service';
import { CustomPageFormContentPreviewModalComponent } from './content-preview-modal/content-preview-modal.component';

/**
 * Allows tenant admins to manage their custom pages
 * (e.g. privacy, TOS, community guidelines)
 *
 */
@Component({
  selector: 'm-customPage__form',
  templateUrl: './custom-page-form.component.html',
  styleUrls: ['./custom-page-form.component.ng.scss'],
})
export class CustomPageFormComponent implements OnInit, OnDestroy {
  @Input() pageType: CustomPageType;

  protected form: FormGroup;

  protected contentMaxLength: number = 65000;

  protected displayName: string;

  protected customPage: CustomPageExtended;

  protected defaultContent: string;

  /** Whether loading is in progress. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Whether saving is in progress. */
  public readonly savingInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /**
   * Allows us to use enum in the template
   */
  public CustomPageImplementation: typeof CustomPageImplementation = CustomPageImplementation;

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private toaster: ToasterService,
    private service: CustomPageService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (!this.pageType) {
      this.loading$.next(false);
      return;
    }
    // Get custom page from server to populate form
    this.subscriptions.push(
      this.service.customPage$.subscribe(customPage => {
        if (customPage) {
          this.customPage = customPage;
          this.displayName = customPage.displayName;
          this.defaultContent = this.service.getDefaultContent(
            this.customPage.pageType
          );
          this.setUpForm();
          this.loading$.next(false);
        }
      })
    );

    this.service.fetchCustomPage(this.pageType);
  }

  setUpForm(): void {
    const initialContent = this.customPage?.content || this.defaultContent;

    this.form = this.fb.group({
      implementation: [this.customPage.implementation],
      content: [initialContent],
      externalLink: [this.customPage?.externalLink],
    });

    // Update validators when implementation changes
    this.form.get('implementation').valueChanges.subscribe(value => {
      if (value === CustomPageImplementation.CUSTOM) {
        this.form
          .get('content')
          .setValidators([
            Validators.required,
            Validators.maxLength(this.contentMaxLength),
          ]);
        this.form.get('externalLink').clearValidators();
      } else if (value === CustomPageImplementation.EXTERNAL) {
        this.form
          .get('externalLink')
          .setValidators([Validators.required, urlValidator()]);
        this.form.get('content').clearValidators();
      } else {
        this.form.get('content').clearValidators();
        this.form.get('externalLink').clearValidators();
      }

      this.form.get('content').updateValueAndValidity();
      this.form.get('externalLink').updateValueAndValidity();
    });
  }

  public async onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.savingInProgress$.next(true);

    const implementation = this.form.get('implementation').value;
    const content = this.form.get('content').value;
    const externalLink = this.form.get('externalLink').value;

    // Create the payload for submission
    let payload: {
      content?: string | null;
      externalLink?: string | null;
    } = {};

    // Determine what needs to be saved, based on the selected implementation.
    // Send a null value for the field(s) that are not related to the chosen implementation
    if (implementation === CustomPageImplementation.CUSTOM) {
      payload.content = content;
      payload.externalLink = null;
    } else if (implementation === CustomPageImplementation.EXTERNAL) {
      payload.content = null;
      payload.externalLink = externalLink;
    } else {
      // DEFAULT
      payload.content = null;
      payload.externalLink = null;
    }

    try {
      const success: boolean = await lastValueFrom(
        this.service.setCustomPage(
          this.pageType,
          payload.content,
          payload.externalLink
        )
      );

      if (!success) {
        throw new Error('An error occurred whilst saving');
      }

      this.toaster.success('Changes saved');

      this.form.markAsPristine();
    } catch (e) {
      console.error(e);
      this.toaster.error(e?.message ?? 'An unknown error has occurred');
    } finally {
      this.savingInProgress$.next(false);
    }
  }

  openContentPreviewModal(showDefaultContent: boolean = true): Promise<void> {
    return this.modalService.present(
      CustomPageFormContentPreviewModalComponent,
      {
        data: {
          content: showDefaultContent
            ? this.defaultContent
            : this.form.get('content').value,
        },
      }
    ).result;
  }

  get showDefaultLink(): boolean {
    return (
      this.form.get('implementation').value === CustomPageImplementation.DEFAULT
    );
  }

  get showContent(): boolean {
    return (
      this.form.get('implementation').value === CustomPageImplementation.CUSTOM
    );
  }

  get showExternalLink(): boolean {
    return (
      this.form.get('implementation').value ===
      CustomPageImplementation.EXTERNAL
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
