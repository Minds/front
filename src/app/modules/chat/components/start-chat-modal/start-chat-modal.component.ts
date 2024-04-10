import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '../../../../common/common.module';
import { AutoCompleteEntityTypeEnum } from '../../../../common/components/forms/autocomplete-entity-input/autocomplete-entity-input.component';
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
import { CreateChatRoomService } from '../../services/create-chat-room.service';
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

@Component({
  selector: 'm-startChatModal',
  templateUrl: './start-chat-modal.component.html',
  styleUrls: ['./start-chat-modal.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    EntityTypeaheadComponent,
  ],
  standalone: true,
})
export class StartChatModalServiceComponent
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

  /** Whether chat creation is in progress. */
  protected readonly creationInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Instantiation time of the class. */
  private readonly instantiationTime: number = Date.now();

  onCompleted: (chatRoomId: string) => void;

  constructor(
    private formBuilder: FormBuilder,
    private createChatRoomService: CreateChatRoomService,
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
  }: {
    onCompleted: (chatRoomId: string) => void;
  }): void {
    this.onCompleted = onCompleted;
  }

  /**
   * Handle confirm click.
   * @returns { Promise<void> }
   */
  protected async onConfirmClick(): Promise<void> {
    try {
      this.creationInProgress$.next(true);
      const selectedUsers: MindsUser[] = this.selectedUsers$.getValue();

      // TODO: Add support for group chats in future.
      const chatRoomId: string =
        await this.createChatRoomService.createChatRoom(selectedUsers);
      this.onCompleted(chatRoomId);
    } catch (e) {
      console.error(e);
      this.toaster.error(DEFAULT_ERROR_MESSAGE);
    } finally {
      this.creationInProgress$.next(false);
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
