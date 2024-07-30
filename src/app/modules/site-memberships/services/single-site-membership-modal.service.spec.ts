import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  SingleSiteMembershipModalOptions,
  SingleSiteMembershipModalService,
} from './single-site-membership-modal.service';
import { ModalService } from '../../../services/ux/modal.service';
import { MockService } from '../../../utils/mock';
import { IsTenantService } from '../../../common/services/is-tenant.service';

describe('SingleSiteMembershipModalService', () => {
  let service: SingleSiteMembershipModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SingleSiteMembershipModalService,
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: IsTenantService, useValue: MockService(IsTenantService) },
      ],
    });

    service = TestBed.inject(SingleSiteMembershipModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should open the modal on tenant', fakeAsync(() => {
    (service as any).isTenant.is.and.returnValue(true);
    const opts: SingleSiteMembershipModalOptions = {
      title: 'title',
      subtitle: 'subtitle',
      closeCtaText: 'closeCtaText',
      upgradeMode: true,
      membershipGuid: 'membershipGuid',
    };

    service.open(opts);
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledWith(
      jasmine.anything(),
      {
        data: {
          title: opts.title,
          subtitle: opts.subtitle,
          closeCtaText: opts.closeCtaText,
          membershipGuid: opts.membershipGuid,
          upgradeMode: opts.upgradeMode,
          onJoinIntent: jasmine.any(Function),
          onCloseIntent: jasmine.any(Function),
        },
        injector: (service as any).injector,
        size: 'lg',
        windowClass: 'm-modalV2__mobileFullCover',
      }
    );
  }));

  it('should NOT open the modal when NOT on tenant', fakeAsync(() => {
    (service as any).isTenant.is.and.returnValue(false);
    const opts: SingleSiteMembershipModalOptions = {
      title: 'title',
      subtitle: 'subtitle',
      closeCtaText: 'closeCtaText',
      upgradeMode: true,
      membershipGuid: 'membershipGuid',
    };

    service.open(opts);
    tick();

    expect((service as any).modalService.present).not.toHaveBeenCalled();
  }));
});
