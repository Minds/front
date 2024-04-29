import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '../../common.module';
import { AutoCompleteEntityTypeEnum } from '../../components/forms/autocomplete-entity-input/autocomplete-entity-input.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EntityTypeaheadComponent } from '../../components/forms/entity-typeahead/entity-typeahead.component';
import { BehaviorSubject, combineLatest, take } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { AbstractSubscriberComponent } from '../../components/abstract-subscriber/abstract-subscriber.component';
import { CDN_URL } from '../../injection-tokens/url-injection-tokens';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../services/toaster.service';

/** User row object. */
type UserRow = {
  user: MindsUser;
  avatarUrl: string;
  selected: boolean;
};

@Component({
  selector: 'm-userSelectionModal',
  templateUrl: './user-selection-modal.component.html',
  styleUrls: ['./user-selection-modal.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    EntityTypeaheadComponent,
  ],
  standalone: true,
})
export class UserSelectionModalComponent
  extends AbstractSubscriberComponent
  implements OnInit, OnDestroy
{
  /** Enum for use in template. */
  protected readonly AutoCompleteEntityTypeEnum: typeof AutoCompleteEntityTypeEnum =
    AutoCompleteEntityTypeEnum;

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

  /** Whether save is in progress. */
  protected readonly saveInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Instantiation time of the class. */
  private readonly instantiationTime: number = Date.now();

  /** Provided function to be called on complete. */
  onCompleted: () => void;

  /** Callback function to handle save action on CTA click. */
  saveFunction: (users: MindsUser[]) => Promise<void>;

  /** Title to be shown in modal. */
  protected title = 'Search for users';

  /** Empty state text to be shown in modal. */
  protected emptyText = 'Search for users';

  /** CTA text to be shown in modal. */
  protected ctaText = 'Confirm';

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
          matches.map((match: MindsUser) => {
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
   * @param onCompleted
   * @returns { void }
   */
  public setModalData({
    onCompleted,
    saveFunction,
    title,
    emptyText,
    ctaText,
  }: {
    onCompleted: () => void;
    saveFunction: (users: MindsUser[]) => Promise<void>;
    title: string;
    emptyText: string;
    ctaText: string;
  }): void {
    this.onCompleted = onCompleted;
    this.saveFunction = saveFunction;
    (this.title = title ?? 'Search for users'),
      (this.emptyText = emptyText ?? 'Search for users'),
      (this.ctaText = ctaText ?? 'Confirm');
  }

  /**
   * Handle confirm click.
   * @returns { Promise<void> }
   */
  protected async onConfirmClick(): Promise<void> {
    try {
      this.saveInProgress$.next(true);

      const selectedUsers: MindsUser[] = this.selectedUsers$.getValue();
      await this.saveFunction(selectedUsers);

      this.onCompleted();
    } catch (e) {
      console.error(e);
      this.toaster.error(DEFAULT_ERROR_MESSAGE);
    } finally {
      this.saveInProgress$.next(false);
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
