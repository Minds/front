import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GroupInviteService } from './invite.service';
import { MindsUser } from '../../../../interfaces/entities';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, of, Subscription, switchMap } from 'rxjs';
import { MindsGroup } from '../group.model';
import { AutoCompleteEntityTypeEnum } from '../../../../common/components/forms/autocomplete-entity-input/autocomplete-entity-input.component';
import { ToasterService } from '../../../../common/services/toaster.service';
import {
  EntityResolverService,
  EntityResolverServiceOptions,
} from '../../../../common/services/entity-resolver.service';

/**
 * Invite modal component
 * For inviting a user to a group
 *
 * Only available for public group members
 * and private group owners
 */
@Component({
  selector: 'm-group__invite',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.ng.scss'],
  providers: [GroupInviteService],
})
export class GroupInviteComponent implements OnInit, OnDestroy {
  /** Enum for use in template. */
  protected readonly AutoCompleteEntityTypeEnum: typeof AutoCompleteEntityTypeEnum =
    AutoCompleteEntityTypeEnum;

  /**
   * Modal save handler
   */
  onSave: (any) => any = () => {};

  /**
   * Modal dismiss intent handler
   */
  onDismissIntent: () => void = () => {};

  /**
   * The user who we want to invite
   */
  invitee: MindsUser;

  /**
   * Whether the username resolver is in progress
   * */
  inProgress: boolean = false;

  formGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    public service: GroupInviteService,
    private fb: UntypedFormBuilder,
    private changeDetector: ChangeDetectorRef,
    private toasterService: ToasterService,
    private entityResolverService: EntityResolverService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      user: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'change',
        },
      ],
    });

    this.subscriptions.push(
      this.formGroup
        .get('user')
        .valueChanges.pipe(
          debounceTime(200),
          switchMap((user: string | MindsUser) => {
            // fallback for if the user does not click on the autocomplete result.
            if (typeof user === 'string') {
              let options = new EntityResolverServiceOptions();
              options.refType = 'username';
              options.ref = user;
              return this.entityResolverService.get$<MindsUser>(options);
            }
            return of(user);
          })
        )
        .subscribe((user: MindsUser): void => {
          if (!user) {
            this.invitee = null;
            return;
          }
          this.inProgress = false;
          this.invitee = user;
        })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Modal options
   *
   * @param onSave
   * @param onDismissIntent
   * @param group
   */
  setModalData({ group, onSave, onDismissIntent }) {
    this.service.setGroup(group);
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  get canSubmit(): boolean {
    return !this.inProgress && this.formGroup.valid && this.formGroup.dirty;
  }

  /**
   * Submit an invitation to the selected user
   */
  async onSubmit(): Promise<void> {
    if (!this.invitee) {
      console.error('No invitee selected');
      return;
    }

    if (!this.invitee.subscriber) {
      this.toasterService.error(
        'You can only invite users who are subscribed to you'
      );
      return;
    }

    this.service.invite(this.invitee);

    // Reset the form
    this.invitee = null;
    this.formGroup.reset(
      {
        user: null,
      },
      {
        emitEvent: false,
      }
    );
    this.formGroup.get('user').setErrors(null);
    this.formGroup.markAsPristine();
    this.changeDetector.detectChanges();
  }

  /**
   * Returns true if user is a moderator, or an owner, which encompasses being a moderator.
   * @param { MindsGroup } group - group to check.
   * @returns { boolean } true if user is a moderator.
   */
  public isModerator(group: MindsGroup): boolean {
    return group['is:owner'] || group['is:moderator'];
  }
}
