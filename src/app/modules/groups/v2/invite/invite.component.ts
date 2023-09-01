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
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  EntityResolverService,
  EntityResolverServiceOptions,
} from '../../../../common/services/entity-resolver.service';
import { Subscription, distinctUntilChanged, switchMap } from 'rxjs';

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
    private entityResolverService: EntityResolverService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      username: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'change',
        },
      ],
    });

    this.subscriptions.push(
      this.formGroup.controls.username.valueChanges
        .pipe(
          distinctUntilChanged(),
          switchMap((username: string) => {
            if (username === '') {
              this.invitee = null;
              this.refreshEligibilityValidator();
              return;
            } else {
              this.inProgress = true;
              let options = new EntityResolverServiceOptions();
              options.refType = 'username';
              options.ref = username;

              return this.entityResolverService.get$<MindsUser>(options);
            }
          })
        )
        .subscribe(user => {
          this.inProgress = false;
          this.invitee = user;
          this.refreshEligibilityValidator();
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
    await this.service.invite(this.invitee);

    // Reset the form
    this.invitee = null;
    this.formGroup.reset(
      {
        username: '',
      },
      {
        emitEvent: false,
      }
    );
    this.formGroup.get('username').setErrors(null);
    this.formGroup.markAsPristine();
    this.changeDetector.detectChanges();
  }

  /**
   * Ensure we are not trying to invite someone who is not a subscriber
   */
  private eligibilityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.invitee && !this.invitee.subscriber) {
        return {
          eligibilityInvalid: true,
        };
      }
    };
  }

  private latestEligibilityValidator: ValidatorFn = null;

  private refreshEligibilityValidator(): void {
    this.removeEligibilityValidator();

    this.latestEligibilityValidator = this.eligibilityValidator();
    this.formGroup.controls.username?.addValidators(
      this.latestEligibilityValidator
    );

    this.formGroup.controls.username?.updateValueAndValidity({
      emitEvent: false,
    });

    this.formGroup.controls.username?.markAsDirty();

    this.changeDetector.detectChanges();
  }

  private removeEligibilityValidator(): void {
    this.formGroup.controls.username?.removeValidators(
      this.latestEligibilityValidator
    );
  }
}
