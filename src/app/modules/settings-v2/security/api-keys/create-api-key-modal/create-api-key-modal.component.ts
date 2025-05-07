import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
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
import { IS_TENANT_NETWORK } from '../../../../../common/injection-tokens/tenant-injection-tokens';
import { Session } from '../../../../../services/session';

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

  scopes: { label: string; key: ApiScopeEnum }[] = [
    {
      label: 'All',
      key: ApiScopeEnum.All,
    },
  ];

  /** Callback for when the modal is completed. */
  onCompleted: (personalApiKey: PersonalApiKey) => void;

  constructor(
    private personalApiKeysService: PersonalApiKeysService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
    private session: Session,
    @Inject(IS_TENANT_NETWORK) private isTenant: boolean
  ) {}

  ngOnInit(): void {
    if (this.isTenant) {
      if (this.session.isAdmin()) {
        this.scopes.push({
          label: 'Site membership write',
          key: ApiScopeEnum.SiteMembershipWrite,
        });
        this.scopes.push({
          label: 'Manage OIDC Users',
          key: ApiScopeEnum.OidcManageUsers,
        });
        this.scopes.push({
          label: 'Read Audit Logs',
          key: ApiScopeEnum.AuditRead,
        });
      }
    }

    this.formGroup = this.formBuilder.group({
      name: 'My Api Key',

      scopes: this.formBuilder.group(
        this.scopes.reduce((acc, { key, label }) => {
          acc[key] = false;
          return acc;
        }, {})
      ),

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
    console.log(this.formGroup.value);

    const allScope: boolean = this.formGroup
      .get('scopes')
      .get(ApiScopeEnum.All).value;
    let scopes: ApiScopeEnum[] = Object.entries(
      this.formGroup.get('scopes').value
    )
      .filter(([_, value]) => value === true)
      .map(([key]) => key as ApiScopeEnum)
      .filter((key) => key !== ApiScopeEnum.All);

    if (!allScope && scopes.length <= 0) {
      throw new Error('At least one scope is required');
    }

    if (allScope) {
      scopes = [];
      scopes.push(ApiScopeEnum.All);
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
