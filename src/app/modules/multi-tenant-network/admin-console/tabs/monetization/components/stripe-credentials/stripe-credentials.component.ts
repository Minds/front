import { Component, OnDestroy, OnInit } from '@angular/core';
import { StripeKeysType } from '../../../../../../../../graphql/generated.engine';
import { BehaviorSubject, Subscription, distinctUntilChanged } from 'rxjs';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StripeKeysService } from '../../services/stripe-keys.service';

/**
 * Stripe credentials entry component.
 */
@Component({
  selector: 'm-networkAdminConsole__stripeCredentials',
  templateUrl: './stripe-credentials.component.html',
  styleUrls: ['./stripe-credentials.component.ng.scss'],
})
export class NetworkAdminStripeCredentialsComponent
  implements OnInit, OnDestroy
{
  /** Whether the component is initializing. */
  public readonly initializing$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Whether a submission is in progress. */
  public readonly submissionInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether the user has stored a secret key. */
  public readonly hasStoredSecretKey$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Form group. */
  private formGroup: FormGroup;

  /** Array of subscriptions. */
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private stripeKeysService: StripeKeysService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      publicKey: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      secretKey: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    if (
      !this.stripeKeysService.initialized$.getValue() &&
      !this.stripeKeysService.fetchInProgress$.getValue()
    ) {
      this.stripeKeysService.fetchStripeKeys(); // async
    }

    this.subscriptions.push(
      this.stripeKeysService.stripeKeys$
        .pipe(distinctUntilChanged())
        .subscribe((stripeKeys: StripeKeysType): void => {
          if (stripeKeys?.pubKey) {
            this.formGroup.get('publicKey').setValue(stripeKeys.pubKey);
          }
          if (stripeKeys?.secKey) {
            this.hasStoredSecretKey$.next(true);
          }
          this.initializing$.next(false);
        })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Handles the form submission.
   * @returns { Promise<void }
   */
  public async onSubmit(): Promise<void> {
    this.submissionInProgress$.next(true);

    const publicKey: string = this.formGroup.get('publicKey').value;
    const secretKey: string = this.formGroup.get('secretKey').value;

    try {
      if (this.formGroup.invalid) {
        throw new Error('The values entered are not valid');
      }

      await this.stripeKeysService.saveStripeKeys(publicKey, secretKey);

      this.formGroup.markAsPristine();
      this.toaster.success('Your Stripe credentials have been saved');
    } catch (e) {
      this.toaster.error(e);
      console.error(e);
    } finally {
      this.submissionInProgress$.next(false);
    }
  }
}
