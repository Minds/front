import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BehaviorSubject } from 'rxjs';
import { BoostModalV2FooterComponent } from './footer.component';
import { BoostModalV2Service } from '../services/boost-modal-v2.service';
import { BoostModalPanel, BoostSubject } from '../boost-modal-v2.types';
import { By } from '@angular/platform-browser';

describe('BoostModalV2FooterComponent', () => {
  let comp: BoostModalV2FooterComponent;
  let fixture: ComponentFixture<BoostModalV2FooterComponent>;

  const getDescriptionTextContent = () =>
    fixture.debugElement.query(
      By.css('.m-boostModalFooter__descriptionTextInnerContainer span')
    )?.nativeElement?.textContent ?? null;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [
          BoostModalV2FooterComponent,
          MockComponent({
            selector: 'm-button',
            inputs: ['solid', 'saving', 'disabled'],
          }),
        ],
        providers: [
          {
            provide: BoostModalV2Service,
            useValue: MockService(BoostModalV2Service, {
              has: [
                'activePanel$',
                'entityType$',
                'boostSubmissionInProgress$',
              ],
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
                boostSubmissionInProgress$: {
                  get: () => new BehaviorSubject<boolean>(false),
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
    fixture = TestBed.createComponent(BoostModalV2FooterComponent);
    comp = fixture.componentInstance;

    comp.activePanel$.next(BoostModalPanel.AUDIENCE);
    (comp as any).entityType$.next(BoostSubject.POST);

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

  it('should call to change panel on button click', fakeAsync(() => {
    comp.activePanel$.next(BoostModalPanel.AUDIENCE);
    comp.onButtonClick(null);
    tick();

    expect((comp as any).service.changePanelFrom).toHaveBeenCalledWith(
      BoostModalPanel.AUDIENCE
    );
  }));

  // audience  panel

  it('should show no text for audience panel', () => {
    (comp as any).entityType$.next(BoostSubject.POST);
    comp.activePanel$.next(BoostModalPanel.AUDIENCE);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toBeNull();
  });

  // budget panel

  it('should show text for budget panel when subject is a post', () => {
    (comp as any).entityType$.next(BoostSubject.POST);
    comp.activePanel$.next(BoostModalPanel.BUDGET);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toContain(
      'Estimated reach is approximate and your Boost will appear in newsfeeds across the site. Actual reach for this Boost may vary and can’t be guaranteed.'
    );
  });

  it('should show text for budget panel when subject is a channel', () => {
    (comp as any).entityType$.next(BoostSubject.CHANNEL);
    comp.activePanel$.next(BoostModalPanel.BUDGET);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toContain(
      'Estimated reach is approximate and your Boost will appear in the sidebar across the site. Actual reach for this Boost may vary and can’t be guaranteed.'
    );
  });

  // review panel

  it('should show text for budget panel when subject is a post', () => {
    (comp as any).entityType$.next(BoostSubject.POST);
    comp.activePanel$.next(BoostModalPanel.REVIEW);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toContain(
      'Once your Boost is approved, your post can not be edited or deleted until the Boost duration is completed. Approved boosts cannot be refunded. By clicking Boost post, you agree to Mind’s Terms.'
    );
  });

  it('should show text for review panel when subject is a channel', () => {
    (comp as any).entityType$.next(BoostSubject.CHANNEL);
    comp.activePanel$.next(BoostModalPanel.REVIEW);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toContain(
      'Once your Boost is approved, your boost can not be edited or deleted until the Boost duration is completed. Approved boosts cannot be refunded. By clicking Boost channel, you agree to Mind’s Terms.'
    );
  });
});