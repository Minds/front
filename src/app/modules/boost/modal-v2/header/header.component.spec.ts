import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BehaviorSubject } from 'rxjs';
import { BoostModalV2HeaderComponent } from './header.component';
import { BoostModalV2Service } from '../services/boost-modal-v2.service';
import { BoostModalPanel, BoostSubject } from '../boost-modal-v2.types';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('BoostModalV2HeaderComponent', () => {
  let comp: BoostModalV2HeaderComponent;
  let fixture: ComponentFixture<BoostModalV2HeaderComponent>;

  const getTitle = (): DebugElement =>
    fixture.debugElement.query(By.css('.m-modalV2Header__title'));

  const getBackButton = (): DebugElement =>
    fixture.debugElement.query(By.css('.m-boostModalV2__headerLeft m-icon'));

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [
          BoostModalV2HeaderComponent,
          MockComponent({
            selector: 'm-icon',
            inputs: ['iconId'],
          }),
          MockComponent({
            selector: 'm-modalCloseButton',
            inputs: ['color', 'absolutePosition'],
          }),
        ],
        providers: [
          {
            provide: BoostModalV2Service,
            useValue: MockService(BoostModalV2Service, {
              has: ['activePanel$', 'entityType$', 'previousPanel$'],
              props: {
                activePanel$: {
                  get: () =>
                    new BehaviorSubject<BoostModalPanel>(
                      BoostModalPanel.AUDIENCE
                    ),
                },
                entityType$: {
                  get: () =>
                    new BehaviorSubject<BoostSubject>(BoostSubject.POST),
                },
                previousPanel$: {
                  get: () => new BehaviorSubject<BoostModalPanel>(null),
                },
              },
            }),
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostModalV2HeaderComponent);
    comp = fixture.componentInstance;

    (comp as any).entityType$.next(BoostSubject.POST);
    (comp as any).activePanel$.next(BoostModalPanel.AUDIENCE);
    // (comp as any).previousPanel$.next(null);

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to navigate to the previous panel on openPreviousPanel call', () => {
    comp.openPreviousPanel();
    expect((comp as any).service.openPreviousPanel).toHaveBeenCalled();
  });

  it('should show correct title for a post', () => {
    (comp as any).entityType$.next(BoostSubject.POST);
    (comp as any).activePanel$.next(BoostModalPanel.BUDGET);
    fixture.detectChanges();
    expect(getTitle().nativeElement.textContent).toBe('Boost Post');
  });

  it('should show correct title for a channel', () => {
    (comp as any).entityType$.next(BoostSubject.CHANNEL);
    (comp as any).activePanel$.next(BoostModalPanel.BUDGET);
    fixture.detectChanges();
    expect(getTitle().nativeElement.textContent).toBe('Boost Channel');
  });

  it('should NOT show back button when there is no previous panel', (done: DoneFn) => {
    (comp as any).activePanel$.next(BoostModalPanel.AUDIENCE);
    (comp as any).service.previousPanel$.subscribe(
      (previousPanel: BoostModalPanel) => {
        expect(previousPanel).toBeNull();
        done();
      }
    );
    fixture.detectChanges();
    expect(getBackButton()).toBeNull();
  });

  it('should show back button on budget panel', () => {
    (comp as any).activePanel$.next(BoostModalPanel.BUDGET);
    (comp as any).previousPanel$.next(BoostModalPanel.AUDIENCE);
    fixture.detectChanges();
    expect(getBackButton()).toBeTruthy();
  });

  it('should show back button on review panel', () => {
    (comp as any).activePanel$.next(BoostModalPanel.REVIEW);
    (comp as any).previousPanel$.next(BoostModalPanel.BUDGET);
    fixture.detectChanges();
    expect(getBackButton()).toBeTruthy();
  });
});
