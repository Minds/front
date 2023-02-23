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

describe('DiscoverySuggestionsComponent', () => {
  let comp: DiscoverySuggestionsComponent;
  let fixture: ComponentFixture<DiscoverySuggestionsComponent>;

  beforeEach(
    waitForAsync(() => {
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
    })
  );

  beforeEach(done => {
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
});
