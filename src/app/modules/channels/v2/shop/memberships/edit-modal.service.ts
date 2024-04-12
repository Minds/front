import { Injectable, Injector } from '@angular/core';
import { SupportTier } from '../../../../wire/v2/support-tiers.service';
import { ChannelShopMembershipsEditComponent } from './edit.component';
import { ModalService } from '../../../../../services/ux/modal.service';

@Injectable()
export class ChannelShopMembershipsEditModalService {
  /**
   * Constructor
   * @param modalService
   * @param injector
   */
  constructor(
    protected modalService: ModalService,
    protected injector: Injector
  ) {}

  /**
   * Presents the composer modal with a custom injector tree
   */
  present(supportTier?: SupportTier | null): Promise<SupportTier> {
    const modal = this.modalService.present(
      ChannelShopMembershipsEditComponent,
      {
        data: {
          supportTier: supportTier || null,
          onSave: (response) => modal.close(response),
        },
        injector: this.injector,
      }
    );

    return modal.result.finally(() => {
      this.injector = void 0;
    });
  }
}
