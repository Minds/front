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
export class NetworkAdminConsoleCustomPageFormComponent
  implements OnInit, OnDestroy {
  @Input() pageType: CustomPageType;

  protected form: FormGroup;

  protected contentMaxLength: number = 65000;

  protected displayName: string;

  protected customPage: CustomPageExtended;

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
    private service: CustomPageService
  ) {}

  ngOnInit(): void {
    if (!this.pageType) {
      this.loading$.next(false);
      return;
    }
    // Get custom page from server to populate form
    this.subscriptions.push(
      this.service.customPage$.subscribe(customPage => {
        this.customPage = customPage;
        this.displayName = customPage.displayName;
        this.setUpForm();
        this.loading$.next(false);
      })
    );

    this.service.fetchCustomPage(this.pageType);
  }

  setUpForm(): void {
    this.form = this.fb.group({
      implementation: [this.customPage.implementation],
      content: [this.customPage?.content],
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

    const customPageImplementation = this.form.get('customPageImplementation')
      .value;
    const content = this.form.get('content').value;
    const externalLink = this.form.get('externalLink').value;

    // Create the payload for submission
    let payload: {
      content?: string | null;
      externalLink?: string | null;
    } = {};

    // Determine what needs to be saved, based on the selected implementation.
    // Send a null value for the field(s) that are not related to the chosen implementation
    if (customPageImplementation === CustomPageImplementation.CUSTOM) {
      payload.content = content;
      payload.externalLink = null;
    } else if (customPageImplementation === CustomPageImplementation.EXTERNAL) {
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

      // Clear implementation-irrelevant values from form
      this.form.patchValue({
        content: payload.content,
        externalLink: payload.externalLink,
      });

      this.form.markAsPristine();
    } catch (e) {
      console.error(e);
      this.toaster.error(e?.message ?? 'An unknown error has occurred');
    } finally {
      this.savingInProgress$.next(false);
    }
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
