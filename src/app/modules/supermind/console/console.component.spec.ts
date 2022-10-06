import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../utils/mock';
import { SupermindExperimentService } from '../../experiments/sub-services/supermind-experiment.service';
import { SupermindOnboardingModalService } from '../onboarding-modal/onboarding-modal.service';
import { SupermindConsoleListType } from '../supermind.types';
import { SupermindConsoleComponent } from './console.component';
import { SupermindConsoleService } from './console.service';

describe('SupermindConsoleComponent', () => {
  let comp: SupermindConsoleComponent;
  let fixture: ComponentFixture<SupermindConsoleComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SupermindConsoleComponent,
          MockComponent({
            selector: 'm-tooltip',
          }),
          MockComponent({
            selector: 'router-outlet',
          }),
          MockComponent({
            selector: 'a',
            inputs: ['routerLink'],
          }),
          MockComponent({
            selector: 'm-addBankPrompt',
          }),
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: MockService(ActivatedRoute, {
              has: ['firstChild'],
              props: {
                firstChild: {
                  get: () => {
                    return { url: new BehaviorSubject([{ path: 'inbox' }]) };
                  },
                },
              },
            }),
          },
          {
            provide: Router,
            useValue: jasmine.createSpyObj('Router', ['navigate']),
          },
          {
            provide: SupermindConsoleService,
            useValue: MockService(SupermindConsoleService, {
              has: ['listType$'],
              props: {
                listType$: {
                  get: () =>
                    new BehaviorSubject<SupermindConsoleListType>('inbox'),
                },
              },
            }),
          },
          {
            provide: SupermindExperimentService,
            useValue: MockService(SupermindExperimentService),
          },
          {
            provide: SupermindOnboardingModalService,
            useValue: MockService(SupermindOnboardingModalService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(SupermindConsoleComponent);
    comp = fixture.componentInstance;

    (comp as any).supermindExperiment.isActive.and.returnValue(false);
    (comp as any).route.firstChild.url.next([{ path: 'inbox' }]);

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('it should set list type on router change to outbox', fakeAsync(() => {
    (comp as any).route.firstChild.url.next([{ path: 'outbox' }]);
    tick();
    expect((comp as any).listType$.getValue()).toBe('outbox');
  }));

  it('it should set list type on router change to inbox', fakeAsync(() => {
    (comp as any).listType$.next('outbox');
    (comp as any).route.firstChild.url.next([{ path: 'inbox' }]);
    tick();
    expect((comp as any).listType$.getValue()).toBe('inbox');
  }));

  it("it should set list type to inbox on router change when subroute isn't recognised", fakeAsync(() => {
    (comp as any).listType$.next('outbox');
    (comp as any).route.firstChild.url.next([{ path: 'unknown' }]);
    tick();
    expect((comp as any).listType$.getValue()).toBe('inbox');
  }));

  it('it should navigate to root domain if experiment is off', () => {
    (comp as any).supermindExperiment.isActive.and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('it should navigate to settings page on settings button click', () => {
    comp.onSettingsButtonClick(null);
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/settings/payments/supermind',
    ]);
  });

  it('it should navigate to inbox page on back button click', () => {
    comp.onBackClick();
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/supermind/inbox',
    ]);
  });
});
