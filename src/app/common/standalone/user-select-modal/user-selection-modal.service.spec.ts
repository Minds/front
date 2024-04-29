import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModalService } from '../../../services/ux/modal.service';
import { MockService } from '../../../utils/mock';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import {
  UserSelectionModalOpts,
  UserSelectionModalService,
} from './user-selection-modal.service';

describe('UserSelectionModalService', () => {
  let service: UserSelectionModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserSelectionModalService,
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: Router, useValue: MockService(Router) },
        { provide: IS_TENANT_NETWORK, useValue: true },
      ],
    });
    service = TestBed.inject(UserSelectionModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should open', fakeAsync(() => {
    (service as any).modalService.present.and.returnValue({
      result: true,
    });

    const opts: UserSelectionModalOpts = {
      saveFunction: async () => void 0,
      ctaText: 'ctaText',
      emptyText: 'emptyText',
      title: 'title',
    };

    service.open(opts);
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledOnceWith(
      jasmine.anything(),
      {
        injector: (service as any).injector,
        lazyModule: jasmine.anything(),
        size: 'md',
        data: {
          onCompleted: jasmine.any(Function),
          saveFunction: opts.saveFunction,
          title: opts.title,
          emptyText: opts.emptyText,
          ctaText: opts.ctaText,
        },
      }
    );
  }));
});
