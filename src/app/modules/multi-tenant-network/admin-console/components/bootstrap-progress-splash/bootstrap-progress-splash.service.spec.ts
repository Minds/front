import {
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { BootstrapProgressSplashService } from './bootstrap-progress-splash.service';
import { ApiService } from '../../../../../common/api/api.service';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';
import { of, throwError } from 'rxjs';
import { MockService } from '../../../../../utils/mock';

describe('BootstrapProgressSplashService', () => {
  let service: BootstrapProgressSplashService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BootstrapProgressSplashService,
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: WINDOW, useValue: { location: { href: '' } } },
      ],
    });

    service = TestBed.inject(BootstrapProgressSplashService);
    Object.defineProperty(service, 'pollingIntervalMs', {
      writable: true,
      value: 1,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startPolling', () => {
    afterEach(() => {
      (service as any).pollingProgressSubscription?.unsubscribe();
    });

    it('should start polling and update bootstrapStepProgress', fakeAsync(() => {
      const mockResponse = [
        {
          tenantId: 1,
          stepName: 'STEP_1',
          stepLoadingLabel: 'Loading Step 1',
          success: true,
          lastRunTimestamp: 123,
        },
        {
          tenantId: 1,
          stepName: 'STEP_2',
          stepLoadingLabel: 'Loading Step 2',
          success: false,
          lastRunTimestamp: null,
        },
      ];
      (service as any).api.get.and.returnValue(of(mockResponse));

      service.startPolling();
      tick(1);

      expect((service as any).api.get).toHaveBeenCalledWith(
        '/api/v3/tenant-bootstrap/progress'
      );
      expect((service as any).bootstrapStepProgress$.value).toEqual(
        mockResponse
      );
      discardPeriodicTasks();
      flush();
    }));

    it('should handle API errors', fakeAsync(() => {
      (service as any).api.get.and.returnValue(
        throwError(() => new Error('API Error'))
      );
      spyOn((service as any).completed$, 'next');

      service.startPolling();
      tick(1);

      expect((service as any).completed$.next).toHaveBeenCalledWith(true);
      discardPeriodicTasks();
      flush();
    }));

    it('should complete when content step is ready', fakeAsync(() => {
      const mockResponse = [
        {
          tenantId: 1,
          stepName: 'STEP_1',
          stepLoadingLabel: 'Loading Step 1',
          success: true,
          lastRunTimestamp: 123,
        },
        {
          tenantId: 1,
          stepName: 'CONTENT_STEP',
          stepLoadingLabel: 'Loading Content',
          success: false,
          lastRunTimestamp: null,
        },
      ];
      (service as any).api.get.and.returnValue(of(mockResponse));
      spyOn((service as any).completed$, 'next');

      service.startPolling();
      tick(1);

      expect((service as any).completed$.next).toHaveBeenCalledWith(true);
      discardPeriodicTasks();
      flush();
    }));
  });

  describe('stopPolling', () => {
    it('should unsubscribe from polling subscription', () => {
      (service as any).pollingProgressSubscription = jasmine.createSpyObj(
        'Subscription',
        ['unsubscribe']
      );
      service.stopPolling();
      expect(
        (service as any).pollingProgressSubscription.unsubscribe
      ).toHaveBeenCalled();
    });
  });

  describe('redirectToNetwork', () => {
    it('should update window.location.href', () => {
      service.redirectToNetwork();
      expect((service as any).window.location.href).toBe(
        '/network/admin/general?awaitContentGeneration=true'
      );
    });
  });

  describe('currentStepLoadingLabel$', () => {
    it('should return the loading label of the current step', (done) => {
      (service as any).bootstrapStepProgress$.next([
        {
          tenantId: 1,
          stepName: 'STEP_1',
          stepLoadingLabel: 'Loading Step 1',
          success: true,
          lastRunTimestamp: 123,
        },
        {
          tenantId: 1,
          stepName: 'STEP_2',
          stepLoadingLabel: 'Loading Step 2',
          success: false,
          lastRunTimestamp: null,
        },
      ]);

      service.currentStepLoadingLabel$.subscribe((label) => {
        expect(label).toBe('Loading Step 2');
        done();
      });
    });

    it('should return default loading text when no steps are in progress', (done) => {
      (service as any).bootstrapStepProgress$.next([
        {
          tenantId: 1,
          stepName: 'STEP_1',
          stepLoadingLabel: 'Loading Step 1',
          success: true,
          lastRunTimestamp: 123,
        },
        {
          tenantId: 1,
          stepName: 'STEP_2',
          stepLoadingLabel: 'Loading Step 2',
          success: true,
          lastRunTimestamp: 456,
        },
      ]);

      service.currentStepLoadingLabel$.subscribe((label) => {
        expect(label).toBe('Loading...');
        done();
      });
    });
  });
});
