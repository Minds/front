import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  UntypedFormGroup,
  FormControl,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';

import { Session } from '../../../../services/session';
import { Storage } from '../../../../services/storage';
import { MessengerService } from '../../../messenger/messenger.service';
import { Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { NostrService } from '../../../nostr/nostr.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import {
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  signEvent,
} from 'nostr-tools';
import * as secp256k1 from '@noble/secp256k1';
import { first, take } from 'rxjs/operators';

/**
 * Settings form for toggling whether to display legacy messenger.
 */
@Component({
  selector: 'm-settingsV2__nostr',
  templateUrl: './nostr.component.html',
  styleUrls: ['./nostr.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2NostrComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  inProgress: boolean = false;
  formGroup: UntypedFormGroup;

  nip05Alias$ = this.nostrService.nip05Alias$;
  publicKey$ = this.nostrService.publicKey$;
  isNip26Setup$ = this.nostrService.isNip26Setup$;
  nip26DelegationToken$ = this.nostrService.nip26DelegationToken$;
  nip26QueryString$ = this.nostrService.nip26QueryString$;

  nip26DelegationTokenSha256Hash: string;
  nip26DelegationTag: string;

  subscriptions: Subscription[];

  constructor(
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected storage: Storage,
    protected nostrService: NostrService,
    protected configs: ConfigsService,
    protected toasterService: ToasterService,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      publicKey: [''],
      privateKey: [''],
      signedDelegationToken: ['', Validators.required],
    });

    this.nostrService.user$$.next(this.session.getLoggedInUser());

    this.subscriptions = [
      this.formGroup.valueChanges.subscribe(values => {
        this.nostrService.nip26PublicKey$$.next(values.publicKey);
        this.nostrService.nip26DelegationTokenSig$$.next(
          values.signedDelegationToken
        );
        this.formGroup.markAsDirty();
      }),
      this.formGroup.controls.privateKey.valueChanges.subscribe(
        async privateKey => {
          /**
           * Generate the signature for the NIP-26 delegation token
           */
          const sig = Buffer.from(
            await secp256k1.schnorr.sign(
              this.nip26DelegationTokenSha256Hash,
              privateKey
            )
          ).toString('hex');

          this.formGroup.controls.signedDelegationToken.setValue(sig);
        }
      ),
      this.nostrService.nip26DelegationTokenSha256Hash$.subscribe(
        nip26DelegationTokenSha256Hash =>
          (this.nip26DelegationTokenSha256Hash = nip26DelegationTokenSha256Hash)
      ),
      this.nostrService.nip26DelegationTag$.subscribe(
        nip26DelegationTag =>
          (this.nip26DelegationTag = JSON.stringify(
            nip26DelegationTag,
            null,
            2
          ))
      ),
    ];

    this.detectChanges();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Called when clicking to generate new keypairs
   * @param e
   */
  async onGenerateKeypairsClick(e: MouseEvent) {
    this.toasterService.warn(
      'Copy your public and private keys below to safe and secure place. Minds does not store a copy of these.'
    );

    /**
     * Create the new keys
     */
    const privateKey = generatePrivateKey();
    const publicKey = getPublicKey(<any>privateKey);

    /**
     * Update the form values
     */
    this.formGroup.controls.publicKey.setValue(publicKey);
    this.formGroup.controls.privateKey.setValue(privateKey);

    this.detectChanges();
  }

  /**
   * Submits the nip26 delegation
   */
  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      return;
    }
    this.inProgress = true;
    this.detectChanges();

    try {
      await this.nostrService.setupNip26Delegation();
      this.toasterService.success('Saved');

      this.nostrService.user$$.next(this.session.getLoggedInUser());
    } catch (e) {
      this.toasterService.error(e?.error.message);
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  /**
   * Removes the delegation
   */
  async deleteNip26(): Promise<void> {
    this.inProgress = true;
    this.detectChanges();

    try {
      await this.nostrService.removeNip26Delegation();
      this.toasterService.success('Saved');

      this.nostrService.user$$.next(this.session.getLoggedInUser());
    } catch (e) {
      this.toasterService.error(e?.error.message);
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canSubmit(): boolean {
    return this.formGroup.valid && !this.inProgress && !this.formGroup.pristine;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
