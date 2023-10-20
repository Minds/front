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
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';

/**
 * Create admin modal component
 * For creating a network admin account
 */
@Component({
  selector: 'm-networks__createAdmin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.ng.scss'],
})
export class NetworksCreateAdminComponent implements OnInit, OnDestroy {
  /**
   * Modal save handler
   */
  onSave: (any) => any = () => {};

  /**
   * Modal dismiss intent handler
   */
  onDismissIntent: () => void = () => {};

  /**
   * Whether the username validator is in progress ojm
   * */
  inProgress: boolean = false;

  formGroup: UntypedFormGroup;

  alphanumericPattern = '^[a-zA-Z0-9_]+$';

  subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private fb: UntypedFormBuilder,
    private changeDetector: ChangeDetectorRef
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
      // Has username been touched
      this.formGroup
        .get('username')
        .valueChanges.pipe(debounceTime(450))
        .subscribe((username: string) => {
          const usernameField: AbstractControl<string> = this.formGroup.get(
            'username'
          );
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
   * @param onSave
   * @param onDismissIntent
   */
  setModalData({ onSave, onDismissIntent }) {
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  get canSubmit(): boolean {
    return !this.inProgress && this.formGroup.valid && this.formGroup.dirty;
  }

  /**
   * On click confirm button
   */
  async onSubmit(): Promise<void> {
    // ojm todo
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
