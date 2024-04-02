import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StartChatModalService } from './start-chat-modal.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { MockService } from '../../../../utils/mock';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

describe('StartChatModalService', () => {
  let service: StartChatModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StartChatModalService,
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: Router, useValue: MockService(Router) },
        { provide: IS_TENANT_NETWORK, useValue: true },
      ],
    });
    service = TestBed.inject(StartChatModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should open', fakeAsync(() => {
    (service as any).modalService.present.and.returnValue({
      result: true,
    });

    service.open();
    tick();

    expect((service as any).modalService.present).toHaveBeenCalled();
  }));
});
