import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Injector, PLATFORM_ID } from '@angular/core';
import { GiftRecipientModalLazyService } from './gift-recipient-modal-lazy.service';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { MockService } from '../../../../../../../utils/mock';
import { GiftCardProductIdEnum } from '../../../../../../../../graphql/generated.engine';
import { GiftRecipientGiftDuration } from './gift-recipient-modal.types';
import { GiftRecipientModalComponent } from './gift-recipient-modal.component';

describe('GiftRecipientModalLazyService', () => {
  let service: GiftRecipientModalLazyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiftRecipientModalLazyService,
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
        Injector,
      ],
    });

    service = TestBed.inject(GiftRecipientModalLazyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open the gift recipient variation of the wire modal', fakeAsync(() => {
    const product: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
    const duration: GiftRecipientGiftDuration = GiftRecipientGiftDuration.YEAR;
    const recipientUsername: string = 'testAccount';
    const isSelfGift: boolean = false;

    service.open(product, duration, recipientUsername, isSelfGift);
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledWith(
      GiftRecipientModalComponent,
      jasmine.objectContaining({
        size: 'md',
        data: jasmine.objectContaining({
          product: product,
          duration: duration,
          recipientUsername: recipientUsername,
          isSelfGift: isSelfGift,
          onSaveIntent: jasmine.any(Function),
        }),
      })
    );
  }));
});
