import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BoostModalV2LazyService } from './boost-modal-v2-lazy.service';
import { MockService } from '../../../utils/mock';
import { ModalService } from '../../../services/ux/modal.service';
import { Injector, PLATFORM_ID } from '@angular/core';
import { UpsellModalService } from '../../modals/upsell/upsell-modal.service';
import { Session } from '../../../services/session';
import { PermissionsService } from '../../../common/services/permissions.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { BoostableEntity } from './boost-modal-v2.types';
import userMock from '../../../mocks/responses/user.mock';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';

describe('BoostModalV2LazyService', () => {
  let service: BoostModalV2LazyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: Injector, useValue: Injector },
        {
          provide: UpsellModalService,
          useValue: MockService(UpsellModalService),
        },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: IS_TENANT_NETWORK, useValue: false },
        BoostModalV2LazyService,
      ],
    });

    service = TestBed.inject(BoostModalV2LazyService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should NOT open the modal when user has no permission', fakeAsync(() => {
    const entity: BoostableEntity = {
      guid: '1',
      type: 'post',
    };
    (service as any).permissionsService.canBoost.and.returnValue(false);

    service.open(entity);
    tick();

    expect((service as any).modalService.present).not.toHaveBeenCalled();
  }));

  describe('openUpsellModal', () => {
    it('should open upsell modal when user is not plus or pro, and is not on tenant', fakeAsync(() => {
      (service as any).session.getLoggedInUser.and.returnValue({
        userMock,
        plus: false,
        pro: false,
      });
      (service as any).isTenantNetwork = false;
      (service as any).upsellModal.open.and.returnValue(Promise.resolve());

      (service as any).openUpsellModal();
      tick(401);

      expect((service as any).upsellModal.open).toHaveBeenCalled();
    }));

    it('should NOT open upsell modal when user is plus or pro', fakeAsync(() => {
      (service as any).session.getLoggedInUser.and.returnValue({
        userMock,
        plus: true,
        pro: true,
      });
      (service as any).isTenantNetwork = false;
      (service as any).upsellModal.open.and.returnValue(Promise.resolve());

      (service as any).openUpsellModal();
      tick(401);

      expect((service as any).upsellModal.open).not.toHaveBeenCalled();
    }));

    it('should NOT open upsell modal when user is on tenant network', fakeAsync(() => {
      (service as any).session.getLoggedInUser.and.returnValue({
        userMock,
        plus: true, // should not be true on tenant, but for the sake of testing
        pro: true,
      });
      (service as any).isTenantNetwork = true;
      (service as any).upsellModal.open.and.returnValue(Promise.resolve());

      (service as any).openUpsellModal();
      tick(401);

      expect((service as any).upsellModal.open).not.toHaveBeenCalled();
    }));
  });
});
