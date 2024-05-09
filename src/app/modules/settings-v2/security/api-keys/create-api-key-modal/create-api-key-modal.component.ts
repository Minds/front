import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../common/common.module';
import { PersonalApiKeysService } from '../service/api-keys.service';
import {
  ApiScopeEnum,
  CreatePersonalApiKeyMutationVariables,
  PersonalApiKey,
} from '../../../../../../graphql/generated.engine';

/** Enum for expiry time periods */
enum ExpireTimePeriodEnum {
  OneDay = 1,
  OneWeek = 7,
  OneMonth = 30,
  ThreeMonth = 90,
  SixMonth = 180,
  OneYear = 365,
  Never = null,
}

/**
 * Modal component for creating a new Personal API key.
 */
@Component({
  selector: 'm-createApiKeyModal',
  templateUrl: './create-api-key-modal.component.html',
  styleUrls: ['./create-api-key-modal.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class CreateApiKeyModalComponent implements OnInit {
  /** Enum for expiry time periods. */
  protected readonly ExpireTimePeriodEnum: typeof ExpireTimePeriodEnum =
    ExpireTimePeriodEnum;

  /** Form group for the modal. */
  protected formGroup: FormGroup;

  /** Callback for when the modal is completed. */
  onCompleted: (personalApiKey: PersonalApiKey) => void;

  constructor(
    private personalApiKeysService: PersonalApiKeysService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: 'My Api Key',
      allScope: false,
      siteMembershipWriteScope: false,
      expireInDays: ExpireTimePeriodEnum.Never,
    });
  }

  /**
   * Modal options.
   * @param { Function } onCompleted - The callback for when the modal is completed.
   * @returns { void }
   */
  public setModalData({
    onCompleted,
  }: {
    onCompleted: (personalApiKey: PersonalApiKey) => void;
  }): void {
    this.onCompleted = onCompleted;
  }

  /**
   * Handles the confirm button click.
   * @returns { Promise<void> }
   */
  protected async onConfirmClick(): Promise<void> {
    try {
      const personalApiKey: PersonalApiKey =
        await this.personalApiKeysService.create(
          this.buildCreateMutationVariables()
        );

      this.onCompleted(personalApiKey);
    } catch (e: unknown) {
      console.error(e);
      this.toaster.error(e);
      return;
    }
  }

  /**
   * Builds the variables for the create mutation.
   * @returns { CreatePersonalApiKeyMutationVariables } The variables for the mutation.
   */
  private buildCreateMutationVariables(): CreatePersonalApiKeyMutationVariables {
    const name: string = this.formGroup.get('name').value;

    if (!name) {
      throw new Error('Name is required');
    }

    const expireInDays: number =
      this.formGroup.get('expireInDays').value ?? null;

    if (expireInDays !== null && expireInDays < 1) {
      console.warn('Invalid days till expiration');
      throw new Error('Invalid days till expiration');
    }

    const allScope: boolean = this.formGroup.get('allScope').value;
    const siteMembershipWriteScope: boolean = this.formGroup.get(
      'siteMembershipWriteScope'
    ).value;

    if (!allScope && !siteMembershipWriteScope) {
      throw new Error('At least one scope is required');
    }

    let scopes: ApiScopeEnum[] = [];

    if (allScope) {
      scopes.push(ApiScopeEnum.All);
    }

    if (siteMembershipWriteScope && !allScope) {
      scopes.push(ApiScopeEnum.SiteMembershipWrite);
    }

    return {
      name: name,
      scopes: scopes,
      expireInDays: expireInDays,
    };
  }

  /**
   * Handles the expiry time period select.
   * @param { ExpireTimePeriodEnum } expireTimePeriod - The expiry time period.
   * @returns { void }
   */
  protected onExpireTimeSelect(expireTimePeriod: ExpireTimePeriodEnum): void {
    this.formGroup.get('expireInDays').setValue(expireTimePeriod);
  }
}
