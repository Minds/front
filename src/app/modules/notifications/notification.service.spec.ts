import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { Session } from '../../services/session';
import { Client } from '../../services/api';
import { SocketsService } from '../../services/sockets';
import { MetaService } from '../../common/services/meta.service';
import { NotificationCountSocketsService } from './notification-count-sockets.service';
import { NotificationCountSocketsExperimentService } from '../experiments/sub-services/notification-count-sockets-experiment.service';
import { SiteService } from '../../common/services/site.service';
import { PLATFORM_ID } from '@angular/core';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: Session, useValue: Session },
        { provide: Client, useValue: Client },
        { provide: SocketsService, useValue: SocketsService },
        { provide: MetaService, useValue: MetaService },
        {
          provide: NotificationCountSocketsService,
          useValue: NotificationCountSocketsService,
        },
        {
          provide: NotificationCountSocketsExperimentService,
          useValue: NotificationCountSocketsExperimentService,
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SiteService, useValue: SiteService },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });
});
