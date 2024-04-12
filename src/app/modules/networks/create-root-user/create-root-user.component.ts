import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { NetworksCreateRootUserService } from './create-root-user.service';

/**
 * Create root user modal component
 * For creating a network root user account
 */
@Component({
  selector: 'm-networks__createRootUser',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-root-user.component.html',
  styleUrls: ['./create-root-user.component.ng.scss'],
})
export class NetworksCreateRootUserComponent implements OnInit, OnDestroy {
  /**
   * Modal save handler
   */
  onSave: () => any = () => {};

  /**
   * Modal dismiss intent handler
   */
  onDismissIntent: () => void = () => {};

  formGroup: UntypedFormGroup;

  /** The pattern of allowed username characters */
  alphanumericPattern = '^[a-zA-Z0-9_]+$';

  subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private fb: UntypedFormBuilder,
    protected service: NetworksCreateRootUserService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      username: [
        '',
        // sync
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
    });

    this.subscriptions.push(
      // Has username been touched? For not showing validation error immediately
      this.formGroup
        .get('username')
        .valueChanges.pipe(debounceTime(450))
        .subscribe((username: string) => {
          const usernameField: AbstractControl<string> =
            this.formGroup.get('username');
          if (!username) {
            usernameField.markAsUntouched();
            return;
          }
          usernameField.markAsTouched();
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
   * @param network
   * @param onSave
   * @param onDismissIntent
   */
  setModalData({ network, onSave, onDismissIntent }) {
    this.service.network$.next(network);
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  get canSubmit(): boolean {
    return this.formGroup.valid && this.formGroup.dirty;
  }

  /**
   * On click confirm button
   */
  async onSubmit(): Promise<void> {
    await this.service.submitUsername(this.username.value);
    this.onSave();
  }

  showError(field: string) {
    return (
      this.formGroup.get(field).invalid &&
      this.formGroup.get(field).touched &&
      this.formGroup.get(field).dirty
    );
  }

  get username() {
    return this.formGroup.get('username');
  }
}
