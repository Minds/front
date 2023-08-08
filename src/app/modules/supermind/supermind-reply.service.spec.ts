import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { MockService } from '../../utils/mock';
import { ComposerModalService } from '../composer/components/modal/modal.service';
import { TwitterConnectionService } from '../twitter/services/twitter-connection.service';
import { ConnectTwitterModalService } from '../twitter/modal/connect-twitter-modal.service';
import { ConnectTwitterModalExperimentService } from '../experiments/sub-services/connect-twitter-modal-experiment.service';
import { ModalService } from '../../services/ux/modal.service';
import { ApiService } from '../../common/api/api.service';
import { ToasterService } from '../../common/services/toaster.service';
import { SupermindReplyService } from './supermind-reply.service';
import { Supermind, SupermindReplyType } from './supermind.types';
import { supermindMock } from '../../mocks/responses/supermind.mock';
import { of } from 'rxjs';

describe('SupermindReplyService', () => {
  let service: SupermindReplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SupermindReplyService,
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        {
          provide: TwitterConnectionService,
          useValue: MockService(TwitterConnectionService),
        },
        {
          provide: ConnectTwitterModalService,
          useValue: MockService(ConnectTwitterModalService),
        },
        {
          provide: ConnectTwitterModalExperimentService,
          useValue: MockService(ConnectTwitterModalExperimentService),
        },
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: Injector, useValue: MockService(Injector) },
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(SupermindReplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startAcceptingLiveSupermind', () => {
    it('should show modal when starting to accept a live Supermind', () => {
      let supermind: Supermind = supermindMock;
      supermind.reply_type = SupermindReplyType.LIVE;

      service.startAcceptingLiveSupermind(supermind);

      expect((service as any).modalService.present).toHaveBeenCalled();
    });

    it('should show error when starting to accept a NON-live as a live Supermind', () => {
      let supermind: Supermind = supermindMock;
      supermind.reply_type = SupermindReplyType.TEXT;

      service.startAcceptingLiveSupermind(supermind);

      expect((service as any).modalService.present).not.toHaveBeenCalled();
      expect((service as any).toasterService.error).toHaveBeenCalledWith(
        'Invalid reply type to accept a live Supermind.'
      );
    });
  });

  describe('acceptLiveSupermind', () => {
    it('should accept a live Supermind', () => {
      (service as any).apiService.post.and.returnValue(of(true));

      let supermind: Supermind = supermindMock;
      supermind.reply_type = SupermindReplyType.LIVE;

      (service as any).acceptLiveSupermind(supermind);

      expect((service as any).apiService.post).toHaveBeenCalledWith(
        'api/v3/supermind/' + supermind.guid + '/accept-live'
      );
    });
  });
});
