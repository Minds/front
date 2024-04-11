import {
  createNgModule,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  ModalRef,
  ModalService,
} from '../../../../../../../services/ux/modal.service';
import { GiftRecipientModalLazyModule } from './gift-recipient-modal-lazy.module';
import { GiftRecipientModalComponent } from './gift-recipient-modal.component';
import { GiftCardProductIdEnum } from '../../../../../../../../graphql/generated.engine';
import { GiftRecipientGiftDuration } from './gift-recipient-modal.types';

/**
 * Service for loading gift recipient modal lazily.
 */
@Injectable({ providedIn: 'root' })
export class GiftRecipientModalLazyService {
  /** Will emit username on completion when a username is passed back. */
  public username$: Subject<string> = new Subject<string>();

  /** Will emit true on completion when a user has opted into a self gift, where they can distribute the link themselves. */
  public isSelfGift$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private modalService: ModalService,
    private injector: Injector,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Lazy load modules and open modal.
   * @param { GiftCardProductIdEnum } product - product to open modal for.
   * @param { GiftRecipientGiftDuration } duration - duration of the upgrade.
   * @param { string } recipientUsername - username of recipient to default to.
   * @param { boolean } isSelfGift - whether to preselect self gift option.
   * @returns { Promise<ModalRef<GiftRecipientModalComponent>> } modal reference.
   */
  public async open(
    product: GiftCardProductIdEnum,
    duration: GiftRecipientGiftDuration,
    recipientUsername?: string,
    isSelfGift?: boolean
  ): Promise<ModalRef<GiftRecipientModalComponent>> {
    const componentRef: typeof GiftRecipientModalComponent =
      await this.getComponentRef();
    const modal = this.modalService.present(componentRef, {
      size: 'md',
      data: {
        product: product,
        duration: duration,
        recipientUsername: recipientUsername,
        isSelfGift: isSelfGift,
        onSaveIntent: (username: string, isSelfGift: boolean): void => {
          if (isSelfGift) {
            this.isSelfGift$.next(true);
          } else if (username?.length) {
            this.username$.next(username);
          }
          modal.close();
        },
      },
    });

    return modal;
  }

  /**
   * Gets reference to component to load.
   * @returns { Promise<typeof GiftRecipientModalComponent> } modal component.
   */
  private async getComponentRef(): Promise<typeof GiftRecipientModalComponent> {
    return createNgModule<GiftRecipientModalLazyModule>(
      (await import('./gift-recipient-modal-lazy.module'))
        .GiftRecipientModalLazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
