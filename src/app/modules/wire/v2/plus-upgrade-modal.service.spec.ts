import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PlusUpgradeModalService } from './plus-upgrade-modal.service';
import { ModalService } from '../../../services/ux/modal.service';
import { MockService } from '../../../utils/mock';
import { WirePaymentHandlersService } from '../wire-payment-handlers.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { ConfigsService } from '../../../common/services/configs.service';

describe('PlusModalService', () => {
  let service: PlusUpgradeModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlusUpgradeModalService,
        { provide: ModalService, useValue: MockService(ModalService) },
        {
          provide: WirePaymentHandlersService,
          useValue: MockService(WirePaymentHandlersService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    });

    service = TestBed.inject(PlusUpgradeModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should open the modal and handle onComplete', fakeAsync(() => {
      const onCompleteFn = jasmine.createSpy('onCompleteFn');
      (service as any).modalService.present.and.returnValue({
        close: () => jasmine.createSpy('close'),
      });
      (service as any).wirePaymentHandlers.get.and.returnValue(
        Promise.resolve()
      );
      (service as any).configs.loadFromRemote.and.returnValue(
        Promise.resolve()
      );

      service.open({ onPurchaseComplete: onCompleteFn });
      tick();

      expect(onCompleteFn).not.toHaveBeenCalled();
      expect((service as any).modalService.present).toHaveBeenCalled();

      (service as any).modalService.present.calls
        .first()
        .args[1].data.onComplete(true);
      tick();

      expect((service as any).configs.loadFromRemote).toHaveBeenCalled();
      expect((service as any).permissions.initFromConfigs).toHaveBeenCalled();
      expect(onCompleteFn).toHaveBeenCalledWith(true);
    }));
  });
});
