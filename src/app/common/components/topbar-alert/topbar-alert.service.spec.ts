import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../services/session';
import { MockService } from '../../../utils/mock';
import { ObjectLocalStorageService } from '../../services/object-local-storage.service';
import { SiteService } from '../../services/site.service';
import {
  AlertKey,
  ALERT_KEYS,
  TopbarAlertService,
} from './topbar-alert.service';

describe('TopbarAlertService', () => {
  let service: TopbarAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TopbarAlertService,
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['loggedinEmitter', 'isProDomain'],
            props: {
              loggedinEmitter: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              isProDomain: { get: () => false },
            },
          }),
        },
        { provide: SiteService, useValue: MockService(SiteService) },
        {
          provide: ObjectLocalStorageService,
          useValue: MockService(ObjectLocalStorageService),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(TopbarAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get active alert on init', () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).objectStorage.getAll.and.returnValue({
      test: '1',
    });

    expect((service as any).getActiveAlert()).toBe(ALERT_KEYS[0]);
    expect((service as any).session.isLoggedIn).toHaveBeenCalled();
    expect((service as any).objectStorage.getAll).toHaveBeenCalledWith(
      (service as any).storageKey
    );
  });

  it('should get no active alert when all dismissed', () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).objectStorage.getAll.and.returnValue({
      wefunder: '1',
    });

    expect((service as any).getActiveAlert()).toBe(null);
    expect((service as any).session.isLoggedIn).toHaveBeenCalled();
    expect((service as any).objectStorage.getAll).toHaveBeenCalledWith(
      (service as any).storageKey
    );
  });

  it('should get no active alert if not logged in', () => {
    (service as any).session.isLoggedIn.and.returnValue(false);

    expect((service as any).getActiveAlert()).toBe(null);
    expect((service as any).session.isLoggedIn).toHaveBeenCalled();
    expect((service as any).objectStorage.getAll).not.toHaveBeenCalled();
  });

  it('should dismiss a notice', (done: DoneFn) => {
    const alertKey: AlertKey = 'wefunder';
    service.dismiss(alertKey);

    expect((service as any).objectStorage.setSingle).toHaveBeenCalledWith(
      (service as any).storageKey,
      {
        [alertKey]: '1',
      }
    );

    service.activeAlert$.subscribe((_activeAlert: AlertKey) => {
      expect(_activeAlert).toBeNull();
      done();
    });
  });
});
