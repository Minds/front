import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BehaviorSubject, of, Subject, take } from 'rxjs';
import { MockComponent, MockService } from '../../../utils/mock';
import { MultiTenantNetworkConfigService } from '../services/config.service';
import { MultiTenantConfig } from '../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../mocks/responses/multi-tenant-config.mock';
import { NetworkAdminConsoleComponent } from './console.component';
import {
  BootstrapProgressSocketService,
  BootstrapSocketEvent,
} from './services/bootstrap-progress-socket.service';
import { ContentGenerationCompletedModalService } from './components/content-generation-completed-modal/content-generation-completed-modal.service';
import { ActivatedRoute } from '@angular/router';
import { BootstrapProgressService } from './services/bootstrap-progress.service';

describe('NetworkAdminConsoleComponent', () => {
  let comp: NetworkAdminConsoleComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleComponent,
        MockComponent({
          selector: 'm-networkAdminConsole__tabs',
        }),
        MockComponent({
          selector: 'router-outlet',
        }),
      ],
      providers: [
        {
          provide: MultiTenantNetworkConfigService,
          useValue: MockService(MultiTenantNetworkConfigService, {
            has: ['config$'],
            props: {
              config$: {
                get: () =>
                  new BehaviorSubject<MultiTenantConfig>(multiTenantConfigMock),
              },
              configLoaded$: { get: () => new BehaviorSubject<boolean>(true) },
            },
          }),
        },
        {
          provide: BootstrapProgressService,
          useValue: MockService(BootstrapProgressService),
        },
        {
          provide: BootstrapProgressSocketService,
          useValue: MockService(BootstrapProgressSocketService, {
            has: ['event$'],
            props: {
              event$: {
                get: () => new Subject<BootstrapSocketEvent>(),
              },
            },
          }),
        },
        {
          provide: ContentGenerationCompletedModalService,
          useValue: MockService(ContentGenerationCompletedModalService),
        },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            snapshot: {
              queryParams: { get: () => ({ awaitContentGeneration: true }) },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleComponent);
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
    comp.ngOnInit();
    expect(
      (comp as any).multiTenantConfigService.fetchConfig
    ).toHaveBeenCalled();
  });

  describe('title$', () => {
    it('should get non-plural title when there is a site name', (done: DoneFn) => {
      const title: string = 'Test site';
      (comp as any).multiTenantConfigService.config$.next({
        siteName: title,
      });

      comp.title$.pipe(take(1)).subscribe((value: string) => {
        expect(value).toBe(`${title}'s Network`);
        done();
      });
    });

    it('should get plural title when there is a site name', (done: DoneFn) => {
      const title: string = 'Test sites';
      (comp as any).multiTenantConfigService.config$.next({
        siteName: title,
      });

      comp.title$.pipe(take(1)).subscribe((value: string) => {
        expect(value).toBe(`${title}' Network`);
        done();
      });
    });

    it('should get non-plural title when no title', (done: DoneFn) => {
      const title: string = null;
      (comp as any).multiTenantConfigService.config$.next({
        siteName: title,
      });

      comp.title$.pipe(take(1)).subscribe((value: string) => {
        expect(value).toBe(`Your Network`);
        done();
      });
    });
  });

  describe('awaitContentGeneration', () => {
    it('should open content gen completed modal when query param is true and it is already completed', fakeAsync(() => {
      (comp as any).route.snapshot.queryParams = {
        awaitContentGeneration: true,
      };
      (
        comp as any
      ).bootstrapProgressService.hasAlreadyCompletedStep.and.returnValue(
        of(true)
      );

      comp.ngOnInit();
      tick();

      expect(
        (comp as any).bootstrapProgressService.hasAlreadyCompletedStep
      ).toHaveBeenCalledWith('CONTENT_STEP');
      expect(
        (comp as any).contentGenerationCompletedModalService.open
      ).toHaveBeenCalled();
      expect(
        (comp as any).bootstrapProgressSocketService.listen
      ).not.toHaveBeenCalled();
    }));

    it('should setup bootstrap progress socket listener when query param is true and open modal', fakeAsync(() => {
      (comp as any).route.snapshot.queryParams = {
        awaitContentGeneration: true,
      };
      (
        comp as any
      ).bootstrapProgressService.hasAlreadyCompletedStep.and.returnValue(
        of(false)
      );

      comp.ngOnInit();
      tick();

      expect(
        (comp as any).bootstrapProgressService.hasAlreadyCompletedStep
      ).toHaveBeenCalledWith('CONTENT_STEP');
      expect(
        (comp as any).bootstrapProgressSocketService.listen
      ).toHaveBeenCalled();

      (comp as any).bootstrapProgressSocketService.event$.next({
        step: 'CONTENT_STEP',
        completed: true,
      });
      tick();

      expect(
        (comp as any).contentGenerationCompletedModalService.open
      ).toHaveBeenCalled();
    }));

    it('should setup bootstrap progress socket listener when query param is true and not open modal when event is not completed', fakeAsync(() => {
      (comp as any).route.snapshot.queryParams = {
        awaitContentGeneration: true,
      };
      (
        comp as any
      ).bootstrapProgressService.hasAlreadyCompletedStep.and.returnValue(
        of(false)
      );

      comp.ngOnInit();
      tick();

      expect(
        (comp as any).bootstrapProgressService.hasAlreadyCompletedStep
      ).toHaveBeenCalledWith('CONTENT_STEP');
      expect(
        (comp as any).bootstrapProgressSocketService.listen
      ).toHaveBeenCalled();

      (comp as any).bootstrapProgressSocketService.event$.next({
        step: 'content',
        completed: false,
      });
      tick();

      expect(
        (comp as any).contentGenerationCompletedModalService.open
      ).not.toHaveBeenCalled();
    }));

    it('should setup bootstrap progress socket listener when query param is true and not open modal when event is for a different step', fakeAsync(() => {
      (comp as any).route.snapshot.queryParams = {
        awaitContentGeneration: true,
      };
      (
        comp as any
      ).bootstrapProgressService.hasAlreadyCompletedStep.and.returnValue(
        of(false)
      );

      comp.ngOnInit();
      tick();

      expect(
        (comp as any).bootstrapProgressService.hasAlreadyCompletedStep
      ).toHaveBeenCalledWith('CONTENT_STEP');
      expect(
        (comp as any).bootstrapProgressSocketService.listen
      ).toHaveBeenCalled();

      (comp as any).bootstrapProgressSocketService.event$.next({
        step: 'other',
        completed: true,
      });
      tick();

      expect(
        (comp as any).contentGenerationCompletedModalService.open
      ).not.toHaveBeenCalled();
    }));

    it('should not setup content generation completed socket listener when query param is false', () => {
      (comp as any).route.snapshot.queryParams = {
        awaitContentGeneration: false,
      };

      comp.ngOnInit();

      expect(
        (comp as any).bootstrapProgressSocketService.listen
      ).not.toHaveBeenCalled();
    });
  });
});
