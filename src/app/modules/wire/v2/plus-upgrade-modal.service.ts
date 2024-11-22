import { Injectable } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { WirePaymentHandlersService } from '../wire-payment-handlers.service';
import { WireCreatorComponent } from './creator/wire-creator.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { PermissionsService } from '../../../common/services/permissions.service';

/** Plus upgrade modal options. */
export type PlusUpgradeModalOptions = {
  onPurchaseComplete?: (result: boolean) => void;
};

/**
 * Service for the showing the Plus upgrade modal.
 */
@Injectable({ providedIn: 'root' })
export class PlusUpgradeModalService {
  constructor(
    private modalService: ModalService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    private permissions: PermissionsService,
    private configs: ConfigsService
  ) {}

  /**
   * Opens the Plus upgrade modal.
   * @param { PlusUpgradeModalOptions } options - The options for the modal.
   * @returns { Promise<ModalRef<WireCreatorComponent>> } ModalRef.
   */
  public async open({
    onPurchaseComplete,
  }: PlusUpgradeModalOptions = {}): Promise<ModalRef<WireCreatorComponent>> {
    const modal: ModalRef<WireCreatorComponent> = this.modalService.present(
      WireCreatorComponent,
      {
        size: 'lg',
        data: {
          entity: await this.wirePaymentHandlers.get('plus'),
          default: {
            type: 'money',
            upgradeType: 'plus',
            upgradeInterval: 'monthly',
          },
          onComplete: async (result: boolean) => {
            if (result) {
              modal.close();
              await this.configs.loadFromRemote();
              this.permissions.initFromConfigs();
              onPurchaseComplete?.(result);
            }
          },
        },
      }
    );
    return modal;
  }
}
