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

@Component({
  selector: 'm-onboardingV5__tagSelectorContent',
  templateUrl: './tag-selector.component.html',
  styleUrls: [
    'tag-selector.component.ng.scss',
    '../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5TagSelectorContentComponent implements OnInit {
  @Input() public readonly title: string;
  @Input() public readonly description: string;
  @Input() public readonly data: ComponentOnboardingV5OnboardingStep;

  public readonly tags$: Observable<DiscoveryTag[]> = this.tagsService
    .userAndDefault$;
  public readonly tagsLoading$: Observable<boolean> = this.tagsService
    .inProgress$;
  public readonly tagsSaving$: Observable<boolean> = this.tagsService.saving$;

  public formGroup: FormGroup;

  public readonly isStepCompleted$: Observable<
    boolean
  > = this.tagsService.tags$.pipe(
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

  public async onTagClick(tag: DiscoveryTag): Promise<void> {
    if (!tag.selected) {
      tag.selected = true;
      await this.tagsService.addTag(tag);
    } else {
      tag.selected = false;
      await this.tagsService.removeTag(tag);
    }
  }

  public async onActionButtonClick(): Promise<void> {
    await this.tagsService.saveTags();
    this.service.continue();
  }

  public onSkipButtonClick(): void {
    this.service.continue();
  }

  public onCustomInputSubmit($event: KeyboardEvent): void {
    $event.preventDefault();

    const formControl: AbstractControl<string> = this.formGroup.get(
      'customTag'
    );
    const errors: ValidationErrors = formControl.errors;

    if (errors) {
      console.log(errors);
      if (formControl?.errors.pattern) {
        this.toast.error(`Tags may only contain alphanumeric characters`);
      }
      if (formControl.errors.maxlength) {
        this.toast.error(
          `Tags must be less than ${formControl.errors.maxlength
            .requiredLength + 1} characters long.`
        );
      }
      if (formControl.errors.minlength) {
        this.toast.error(
          `Tags must be ${formControl.errors.minlength.requiredLength} or more characters long.`
        );
      }
      return;
    }

    this.addTag({
      selected: true,
      value: formControl.value,
      type: 'user',
    });
  }

  private addTag(tag: DiscoveryTag): void {
    this.tagsService.addSingleTag(tag);
    const userAndDefaultTags = this.tagsService.userAndDefault$.getValue();
    userAndDefaultTags.push(tag);
    this.tagsService.userAndDefault$.next(userAndDefaultTags);
  }
}
