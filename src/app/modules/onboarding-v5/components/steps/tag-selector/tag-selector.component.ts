import { Component, Input, OnInit } from '@angular/core';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import {
  DiscoveryTag,
  DiscoveryTagsService,
} from '../../../../discovery/tags/tags.service';
import { Observable, map } from 'rxjs';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { OnboardingStepContentInterface } from '../step-content.interface';

/**
 * Tag selector content panel for onboarding v5.
 * Allows a user to select their tag preferences.
 */
@Component({
  selector: 'm-onboardingV5__tagSelectorContent',
  templateUrl: './tag-selector.component.html',
  styleUrls: [
    'tag-selector.component.ng.scss',
    '../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5TagSelectorContentComponent
  implements OnInit, OnboardingStepContentInterface
{
  /** Title for section. */
  @Input() public title: string;

  /** Description for section. */
  @Input() public description: string;

  /** Data from CMS. */
  @Input() public data: ComponentOnboardingV5OnboardingStep;

  /** Tags from tags service. */
  public readonly tags$: Observable<DiscoveryTag[]> =
    this.tagsService.userAndDefault$;

  /** Whether tags are currently loading. */
  public readonly tagsLoading$: Observable<boolean> =
    this.tagsService.inProgress$;

  /** Whether tags are currently saving. */
  public readonly tagsSaving$: Observable<boolean> = this.tagsService.saving$;

  /** Form group. */
  public formGroup: FormGroup;

  /** Whether step can be considered completed based upon the amount of selected tags. */
  public readonly isStepCompleted$: Observable<boolean> =
    this.tagsService.tags$.pipe(
      map((tags: DiscoveryTag[]): boolean => {
        return (
          tags.filter((tag: DiscoveryTag): boolean => {
            return tag.selected;
          })?.length >= 3
        );
      })
    );

  constructor(
    private service: OnboardingV5Service,
    private tagsService: DiscoveryTagsService,
    private toast: ToasterService
  ) {}

  ngOnInit(): void {
    this.tagsService.loadTags();

    this.formGroup = new FormGroup({
      customTag: new FormControl<string>('', [
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
    });
  }

  /**
   * Fired on tag click - adds or removes the tag.
   * @param { DiscoveryTag } tag - tag to add or remove.
   * @returns { Promise<void> }
   */
  public async onTagClick(tag: DiscoveryTag): Promise<void> {
    if (!tag.selected) {
      tag.selected = true;
      await this.tagsService.addTag(tag);
    } else {
      tag.selected = false;
      await this.tagsService.removeTag(tag);
    }
  }

  /**
   * On action button click - save all tags and then continue.
   * @returns { Promise<void> }
   */
  public async onActionButtonClick(): Promise<void> {
    await this.tagsService.saveTags();
    this.service.continue();
  }

  /**
   * On skip button click - skip.
   * @returns { void }
   */
  public onSkipButtonClick(): void {
    this.service.continue();
  }

  /**
   * Handles submission of a custom tag.
   * @param { KeyboardEvent } $event - keyboard event.
   * @returns { void }
   */
  public onCustomInputSubmit($event: KeyboardEvent): void {
    $event.preventDefault();

    const formControl: AbstractControl<string> =
      this.formGroup.get('customTag');
    const errors: ValidationErrors = formControl.errors;

    if (errors) {
      if (formControl?.errors.pattern) {
        this.toast.error(`Tags may only contain alphanumeric characters`);
      }
      if (formControl.errors.maxlength) {
        this.toast.error(
          `Tags must be less than ${
            formControl.errors.maxlength.requiredLength + 1
          } characters long.`
        );
      }
      if (formControl.errors.minlength) {
        this.toast.error(
          `Tags must be ${formControl.errors.minlength.requiredLength} or more characters long.`
        );
      }
      return;
    }

    if (
      this.tagsService.userAndDefault$.value.findIndex(
        (i) => i.value.toLowerCase() === formControl.value.toLowerCase()
      ) !== -1
    ) {
      this.toast.warn('This tag has already been added');
      return;
    }

    this.addTag({
      selected: true,
      value: formControl.value,
      type: 'user',
    });

    formControl.reset();
  }

  /**
   * Add a tag to the tags service.
   * @param { DiscoveryTag } tag - tag to add.
   * @returns { void }
   */
  private addTag(tag: DiscoveryTag): void {
    if (
      this.tagsService.userAndDefault$
        .getValue()
        .findIndex((i) => i.value === tag.value) === -1
    ) {
      this.tagsService.userAndDefault$.next([
        ...this.tagsService.userAndDefault$.value,
        tag,
      ]);

      this.tagsService.addTag(tag);
    }
  }
}
