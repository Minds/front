import { HttpClient } from '@angular/common/http';
import { MockService } from '../../../utils/mock';
import { TestBed } from '@angular/core/testing';
import { LivestreamService } from './livestream.service';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { PermissionIntentsService } from '../../../common/services/permission-intents.service';
import userMock from '../../../mocks/responses/user.mock';
import { of } from 'rxjs';

describe('LivestreamService', () => {
  let service: LivestreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: MockService(HttpClient) },
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
      ],
    });

    service = TestBed.inject(LivestreamService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should create a live stream if the user is an admin', () => {
    (service as any).session.isAdmin.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue(userMock);
    (service as any).http.post.and.returnValue(of({ status: 200 }));

    service.createLiveStream();

    expect((service as any).http.post).toHaveBeenCalled();
  });

  it('should not create a live stream if the user is not an admin', () => {
    (service as any).session.isAdmin.and.returnValue(false);

    service.createLiveStream();

    expect((service as any).http.post).not.toHaveBeenCalled();
  });
});
