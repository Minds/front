import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BoostCancelModalService } from './cancel-modal.service';
import { MockService } from '../../../../utils/mock';
import { ModalService } from '../../../../services/ux/modal.service';
import { Injector } from '@angular/core';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';

describe('BoostCancelModalService', () => {
  let service: BoostCancelModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BoostCancelModalService,
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        Injector,
      ],
    });

    service = TestBed.inject(BoostCancelModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should open the confirm dialog for self boost cancellation', fakeAsync(() => {
    service.confirmSelfBoostCancellation();
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledOnceWith(
      ConfirmV2Component,
      {
        data: {
          title: 'Cancel this Boost?',
          body: 'Are you sure you want to cancel this Boost? If it is already running, then it **will not be refunded**.',
          confirmButtonText: 'Cancel Boost',
          confirmButtonColor: 'red',
          showCancelButton: false,
          onConfirm: jasmine.any(Function),
        },
        injector: (service as any).injector,
      }
    );
  }));

  it('should open the confirm dialog for moderator boost cancellation', fakeAsync(() => {
    service.confirmModeratorBoostCancellation();
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledOnceWith(
      ConfirmV2Component,
      {
        data: {
          title: 'Cancel this Boost?',
          body: 'Are you sure you want to cancel this Boosted post? All active Boosts with this post will be immediately cancelled and will stop serving on your network, and the customer(s) **will not be refunded**.',
          confirmButtonText: 'Cancel Boost',
          confirmButtonColor: 'red',
          showCancelButton: false,
          onConfirm: jasmine.any(Function),
        },
        injector: (service as any).injector,
      }
    );
  }));
});
