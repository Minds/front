import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, take } from 'rxjs';
import { MockComponent, MockService } from '../../../utils/mock';
import { MultiTenantNetworkConfigService } from '../services/config.service';
import { MultiTenantConfig } from '../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../mocks/responses/multi-tenant-config.mock';
import { NetworkAdminConsoleComponent } from './console.component';

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
});
