import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { PersonalApiKeysService } from './service/api-keys.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonalApiKey } from '../../../../../graphql/generated.engine';
import { CreateApiKeyModalService } from './create-api-key-modal/create-api-key-modal.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { CopyToClipboardService } from '../../../../common/services/copy-to-clipboard.service';

/**
 * Settings page for personal api keys.
 */
@Component({
  selector: 'm-settingsV2__apiKeys',
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ApiKeysComponent {
  /** Existing API key details. */
  protected readonly keys$: Observable<PersonalApiKey[]> =
    this.personalApiKeysService.keys$;

  /** The last created secret (when populated, will show the secret to be copied). */
  protected readonly lastCreatedSecret$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  /** Whether a delete action is in progress. */
  protected readonly deleteInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private personalApiKeysService: PersonalApiKeysService,
    private createApiKeyModalService: CreateApiKeyModalService,
    private toasterService: ToasterService,
    private copyToClipboardService: CopyToClipboardService,
    private cd: ChangeDetectorRef
  ) {}

  /**
   * Handles create click.
   * @returns { Promise<void> }
   */
  protected async onCreateClick(): Promise<void> {
    const result: PersonalApiKey = await this.createApiKeyModalService.open();

    if (!result) {
      return;
    }

    this.lastCreatedSecret$.next(result.secret);
    this.toasterService.success('Personal API key created');
    this.personalApiKeysService.refetch();
  }

  /**
   * Handles delete click.
   * @param { string } keyId - The key ID.
   * @returns { Promise<void> }
   */
  protected async onDeleteClick(keyId: string): Promise<void> {
    if (this.deleteInProgress$.getValue()) {
      return;
    }

    this.deleteInProgress$.next(true);

    try {
      await this.personalApiKeysService.delete(keyId);
      this.personalApiKeysService.refetch();
    } catch (e: unknown) {
      console.error(e);
      this.toasterService.error('Failed to delete personal API key');
    } finally {
      this.deleteInProgress$.next(false);
    }
  }

  /**
   * Handles content copy click.
   * @returns { Promise<void> }
   */
  protected async onCopySecretToClipboardClick(): Promise<void> {
    await this.copyToClipboardService.copyToClipboard(
      this.lastCreatedSecret$.getValue()
    );
    this.toasterService.success('Secret copied to clipboard');
  }
}
