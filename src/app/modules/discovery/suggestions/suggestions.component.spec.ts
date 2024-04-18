import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MockComponent, MockService } from '../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../services/session';
import { SuggestionsService } from '../../suggestions/channel/channel-suggestions.service';
import { Location } from '@angular/common';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { DiscoverySuggestionsComponent } from './suggestions.component';
import { DiscoveryService } from '../discovery.service';
import { EventEmitter } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToasterService } from '../../../common/services/toaster.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';

describe('DiscoverySuggestionsComponent', () => {
  let comp: DiscoverySuggestionsComponent;
  let fixture: ComponentFixture<DiscoverySuggestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DiscoverySuggestionsComponent,
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress'],
        }),
      ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: DiscoveryService,
          useValue: MockService(DiscoveryService),
        },
        {
          provide: Location,
          useValue: MockService(Location),
        },
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['loggedinEmitter'],
            props: {
              loggedinEmitter: { get: () => new EventEmitter<boolean>() },
            },
          }),
        },
        {
          provide: AuthModalService,
          useValue: MockService(AuthModalService),
        },
        { provide: IS_TENANT_NETWORK, useValue: false },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    })
      .overrideProvider(SuggestionsService, {
        useValue: MockService(SuggestionsService, {
          has: ['suggestions$', 'inProgress$', 'hasMoreData$'],
          props: {
            suggestions$: { get: () => new BehaviorSubject<any[]>([]) },
            inProgress$: { get: () => new BehaviorSubject<boolean>(false) },
            hasMoreData$: { get: () => new BehaviorSubject<boolean>(true) },
          },
        }),
      })
      .compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(DiscoverySuggestionsComponent);
    comp = fixture.componentInstance;

    (comp as any).session.getLoggedInUser.and.returnValue({ guid: '123' });

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should show login modal if not logged in on init', () => {
    (comp as any).session.getLoggedInUser.and.returnValue(null);
    comp.ngOnInit();

    expect((comp as any).authModal.open).toHaveBeenCalledWith({
      formDisplay: 'login',
    });
  });

  it('should load on login', fakeAsync(() => {
    (comp as any).session.getLoggedInUser.and.returnValue(null);
    comp.ngOnInit();

    (comp as any).session.loggedinEmitter.emit(true);
    tick();

    expect((comp as any).service.load).toHaveBeenCalled();
  }));

  it('should not show login modal when not logged in on init', () => {
    (comp as any).session.getLoggedInUser.and.returnValue({ guid: '123' });
    comp.ngOnInit();

    expect((comp as any).authModal.open).not.toHaveBeenCalled();
  });

  describe('loadSuggestions', () => {
    it('should call to load for tenant when on a tenant network for channels', () => {
      const type: string = 'user';
      const refresh: boolean = true;

      (comp as any).isTenantNetwork = true;
      comp.type = type;

      (comp as any).loadSuggestions(refresh);

      expect((comp as any).service.loadForTenant).toHaveBeenCalledWith({
        refresh: refresh,
        type: type,
      });
    });

    it('should call to load for tenant when on a tenant network for groups', () => {
      const type: string = 'group';
      const refresh: boolean = false;

      (comp as any).isTenantNetwork = true;
      comp.type = type;

      (comp as any).loadSuggestions(refresh);

      expect((comp as any).service.loadForTenant).toHaveBeenCalledWith({
        refresh: refresh,
        type: type,
      });
    });

    it('should call to load when on a non-tenant network for channels', () => {
      const type: string = 'user';
      const refresh: boolean = true;
      const limit: number = 12;
      const user: string = '1234567890123456';

      (comp as any).isTenantNetwork = false;
      comp.limit = limit;
      comp.type = type;
      comp.contextualUser = user;

      (comp as any).loadSuggestions(refresh);

      expect((comp as any).service.load).toHaveBeenCalledWith({
        limit: limit,
        refresh: refresh,
        type: type,
        user: user,
      });
    });

    it('should call to load when on a non-tenant network for channels when loadMore is invoked', () => {
      const type: string = 'user';
      const refresh: boolean = false;
      const limit: number = 12;
      const user: string = '1234567890123456';

      (comp as any).isTenantNetwork = false;
      comp.limit = limit;
      comp.type = type;
      comp.contextualUser = user;

      (comp as any).loadSuggestions(refresh);

      expect((comp as any).service.load).toHaveBeenCalledWith({
        limit: limit,
        refresh: refresh,
        type: type,
        user: null,
      });
    });
  });
});
