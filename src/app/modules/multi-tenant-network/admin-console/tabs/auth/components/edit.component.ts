import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  CreateOidcProviderGQL,
  OidcProviderPublic,
  UpdateOidcProviderGQL,
} from '../../../../../../../graphql/generated.engine';

export type EditOidcProviderModalInputParams = {
  provider?: OidcProviderPublic;
  onDone: () => void;
};

const REDACTED_SECRET_TEXT = 'redacted';

@Component({
  selector: 'm-networkAdminConsoleAuth__edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class NetworkAdminConsoleAuthEditComponent {
  /** Form group for the modal. */
  protected formGroup: FormGroup;

  onDone = () => {};

  get isEditing(): boolean {
    return !!this.formGroup.get('id').value;
  }

  constructor(
    private formBuilder: FormBuilder,
    private addOidcProviderGql: CreateOidcProviderGQL,
    private updateOidcProvidersGql: UpdateOidcProviderGQL
  ) {
    this.formGroup = this.formBuilder.group({
      id: null,
      name: '',
      issuer: '',
      clientId: '',
      clientSecret: '',
    });
  }

  async onConfirmClick() {
    if (this.isEditing) {
      const value = this.formGroup.value;
      if (value.clientSecret === REDACTED_SECRET_TEXT) {
        delete value.clientSecret;
      }
      await firstValueFrom(this.updateOidcProvidersGql.mutate(value));
    } else {
      await firstValueFrom(
        this.addOidcProviderGql.mutate(this.formGroup.value)
      );
    }

    this.onDone();
  }

  /**
   * Set modal data.
   * @param { EditOidcProviderModalInputParams } data - data for modal.
   * @returns { void }
   */
  public setModalData({
    provider,
    onDone,
  }: EditOidcProviderModalInputParams): void {
    if (provider) {
      this.formGroup.patchValue({
        id: provider.id,
        name: provider.name,
        issuer: provider.issuer,
        clientId: provider.clientId,
        clientSecret: REDACTED_SECRET_TEXT,
      });
    }
    this.onDone = onDone;
  }
}
