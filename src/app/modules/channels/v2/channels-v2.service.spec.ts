import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import { ActivatedRoute } from '@angular/router';
import { ChannelsV2Service } from './channels-v2.service';
import userMock from '../../../mocks/responses/user.mock';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';

describe('ChannelsV2Service', () => {
  let service: ChannelsV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChannelsV2Service,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj<ApiService>(['get']),
        },
        {
          provide: Session,
          useValue: jasmine.createSpyObj<Session>([], {
            user$: new BehaviorSubject<MindsUser>(userMock),
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: jasmine.createSpyObj<ActivatedRoute>([], ['snapshot']),
        },
      ],
    });

    service = TestBed.inject(ChannelsV2Service);

    (service as any).api.get.calls.reset();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('getChannelByIdentifier', () => {
    it('should get channel by identifier', async () => {
      const guid: string = '1234567890123456';
      (service as any).api.get.and.returnValue(of({ channel: userMock }));

      service.getChannelByIdentifier(guid);

      await expectAsync(service.getChannelByIdentifier(guid)).toBeResolvedTo(
        userMock
      );
    });

    it('should return null when no channel is found by identifier', async () => {
      spyOn(console, 'error');
      const guid: string = '1234567890123456';
      const error: Error = new Error('~error~');
      (service as any).api.get.and.returnValue(throwError(() => error));

      service.getChannelByIdentifier(guid);

      await expectAsync(service.getChannelByIdentifier(guid)).toBeResolvedTo(
        null
      );
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
