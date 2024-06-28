import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModalService } from '../../../../services/ux/modal.service';
import { MockService } from '../../../../utils/mock';
import {
  UserSelectModalOpts,
  UserSelectModalService,
} from './user-select-modal.service';
import { UserSelectModalModule } from './user-select-modal.module';

describe('UserSelectModalService', () => {
  let service: UserSelectModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserSelectModalService,
        { provide: ModalService, useValue: MockService(ModalService) },
      ],
    });
    service = TestBed.inject(UserSelectModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should open', fakeAsync(() => {
    (service as any).modalService.present.and.returnValue({
      result: true,
    });

    const opts: UserSelectModalOpts = {
      saveFunction: async () => true,
      title: 'title',
      ctaText: 'ctaText',
      emptyStateText: 'emptyStateText',
    };

    service.open(opts);
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledWith(
      jasmine.anything(),
      {
        injector: (service as any).injector,
        lazyModule: UserSelectModalModule,
        size: 'md',
        data: {
          title: opts.title,
          ctaText: opts.ctaText,
          emptyStateText: opts.emptyStateText,
          excludedUserGuids: opts.excludedUserGuids ?? null,
          onCompleted: jasmine.any(Function),
        },
      }
    );
  }));
});
