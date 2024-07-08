import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '../../../../common/common.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EntityTypeaheadComponent } from '../../../../common/components/forms/entity-typeahead/entity-typeahead.component';
import { BehaviorSubject, combineLatest, take } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { CDN_URL } from '../../../../common/injection-tokens/url-injection-tokens';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../common/services/toaster.service';

/** User row object. */
type UserRow = {
  user: MindsUser;
  avatarUrl: string;
  selected: boolean;
};

/**
 * Modal that allows the search and selection of users - save function must
 * be passed in to handle the processing of the selected users.
 */
@Component({
  selector: 'm-userSelectModal',
  templateUrl: './user-select-modal.component.html',
  styleUrls: ['./user-select-modal.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    EntityTypeaheadComponent,
  ],
  standalone: true,
})
export class UserSelectModalComponent
  extends AbstractSubscriberComponent
  implements OnInit, OnDestroy
{
  /** Whether the component is in a loading state. */
  protected readonly loadingResults$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Form group. */
  protected formGroup: FormGroup;

  /** Search matches. */
  protected readonly searchMatches$: BehaviorSubject<UserRow[]> =
    new BehaviorSubject<UserRow[]>([]);

  /** Selected users. */
  protected readonly selectedUsers$: BehaviorSubject<MindsUser[]> =
    new BehaviorSubject<MindsUser[]>([]);

  /** Whether save action is in progress. */
  protected readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Instantiation time of the class. */
  private readonly instantiationTime: number = Date.now();

  /**
   * Callback function to handle the selected users.
   * @param { MindsUser[] } selectedUsers - The selected users.
   * @returns { Promise<void> }
   */
  private onCompleted: (selectedUsers: MindsUser[]) => Promise<void>;

  /** Modal title. */
  protected title: string = 'Select users';

  /** Modal CTA text. */
  protected ctaText: string = 'Confirm';

  /** Modal empty state text. */
  protected emptyStateText: string = 'No users found';

  /** Excluded user GUIDs. */
  protected excludedUserGuids: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
    @Inject(CDN_URL) private readonly cdnUrl: string
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      searchMatchedUsers: ['', { validators: [Validators.required] }],
    });

    this.subscriptions.push(
      combineLatest([
        this.formGroup.get('searchMatchedUsers').valueChanges,
        this.selectedUsers$,
      ]).subscribe(([matches, selectedUsers]: [MindsUser[], MindsUser[]]) => {
        this.searchMatches$.next(
          matches
            .filter(
              (match: MindsUser) => !this.excludedUserGuids.includes(match.guid)
            )
            .map((match: MindsUser) => {
              return {
                user: match,
                avatarUrl: `${this.cdnUrl}icon/${match?.guid}/large/${this.instantiationTime}`,
                selected: selectedUsers.some(
                  (selectedUser: MindsUser) => match.guid === selectedUser.guid
                ),
              };
            })
        );
      })
    );
  }

  /**
   * Toggle user selection.
   * @param { MindsUser } user - The user to toggle.
   * @returns { void }
   */
  protected toggleUserSelect(user: MindsUser): void {
    this.subscriptions.push(
      this.selectedUsers$
        .pipe(take(1))
        .subscribe((selectedUsers: MindsUser[]): void => {
          if (
            selectedUsers.some(
              (selectedUser: MindsUser) => user.guid === selectedUser.guid
            )
          ) {
            selectedUsers = selectedUsers.filter(
              (selectedUser: MindsUser) => user.guid !== selectedUser.guid
            );
          } else {
            selectedUsers = [...selectedUsers, user];
          }

          this.selectedUsers$.next(selectedUsers);
        })
    );
  }

  /**
   * Modal options
   * @param { any } opts - modal options.
   * @returns { void }
   */
  public setModalData({
    onCompleted,
    title,
    ctaText,
    emptyStateText,
    excludedUserGuids,
  }: {
    onCompleted: (selectedUsers: MindsUser[]) => Promise<void>;
    title: string;
    ctaText: string;
    emptyStateText: string;
    excludedUserGuids?: string[];
  }): void {
    this.onCompleted = onCompleted;
    this.title = title;
    this.ctaText = ctaText;
    this.emptyStateText = emptyStateText;
    this.excludedUserGuids = excludedUserGuids;
  }

  /**
   * Handle confirm click.
   * @returns { Promise<void> }
   */
  protected async onConfirmClick(): Promise<void> {
    try {
      this.inProgress$.next(true);
      await this.onCompleted(this.selectedUsers$.getValue());
    } catch (e) {
      console.error(e);
      this.toaster.error(DEFAULT_ERROR_MESSAGE);
    } finally {
      this.inProgress$.next(false);
    }
  }

  /**
   * Handles the loading state change of the typeahead.
   * @param { boolean } $event - The loading state.
   * @returns { void }
   */
  protected onTypeaheadLoadingStateChange($event: boolean): void {
    this.loadingResults$.next($event);
  }

  /**
   * Handles the typeahead selection change.
   * @param { MindsUser } $event - The selected user.
   * @returns { string } unique track by key.
   */
  protected trackResultsBy(user: MindsUser): string {
    return user?.guid;
  }
}
