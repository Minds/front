import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BoostModalV2AudienceSelectorComponent } from './audience.component';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostAudience } from '../../boost-modal-v2.types';
import { MockService } from '../../../../../utils/mock';
import { BoostTargetExperimentService } from '../../../../experiments/sub-services/boost-target-experiment.service';

describe('BoostModalV2AudienceSelectorComponent', () => {
  let comp: BoostModalV2AudienceSelectorComponent;
  let fixture: ComponentFixture<BoostModalV2AudienceSelectorComponent>;

  const getSelectedRadioButtonLabel = (): DebugElement =>
    fixture.debugElement.query(
      By.css('.m-boostAudienceSelector__radioButtonRow--selected label')
    );

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule],
        declarations: [BoostModalV2AudienceSelectorComponent],
        providers: [
          {
            provide: BoostModalV2Service,
            useValue: MockService(BoostModalV2Service, {
              has: ['audience$', 'disabledSafeAudience$'],
              props: {
                audience$: {
                  get: () =>
                    new BehaviorSubject<BoostAudience>(BoostAudience.SAFE),
                },
                disabledSafeAudience$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
              },
            }),
          },
          {
            provide: BoostTargetExperimentService,
            useValue: MockService(BoostTargetExperimentService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostModalV2AudienceSelectorComponent);
    comp = fixture.componentInstance;

    (comp as any).service.audience$.next(BoostAudience.SAFE);
    (comp as any).service.disabledSafeAudience$.next(false);

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

  it('should get whether safe option is disabled from service', (done: DoneFn) => {
    (comp as any).service.disabledSafeAudience$.next(true);
    (comp as any).service.disabledSafeAudience$.subscribe(
      (disabledSafeAudience: BoostAudience) => {
        expect(disabledSafeAudience).toBeTrue();
        done();
      }
    );
  });

  it('should get whether safe option is NOT disabled from service', (done: DoneFn) => {
    (comp as any).service.disabledSafeAudience$.next(false);
    (comp as any).service.disabledSafeAudience$.subscribe(
      (disabledSafeAudience: BoostAudience) => {
        expect(disabledSafeAudience).toBeFalse();
        done();
      }
    );
  });

  it('should update service when safe is selected', (done: DoneFn) => {
    (comp as any).service.audience$.next(BoostAudience.CONTROVERSIAL);
    (comp as any).service.disabledSafeAudience$.next(false);
    comp.selectRadioButton(BoostAudience.SAFE);

    (comp as any).service.audience$.subscribe((audience: BoostAudience) => {
      expect(audience).toBe(BoostAudience.SAFE);
      done();
    });
  });

  it('should NOT update service to safe when safe is disabled', (done: DoneFn) => {
    (comp as any).service.audience$.next(BoostAudience.CONTROVERSIAL);
    (comp as any).service.disabledSafeAudience$.next(true);

    comp.selectRadioButton(BoostAudience.SAFE);

    (comp as any).service.audience$.subscribe((audience: BoostAudience) => {
      expect(audience).toBe(BoostAudience.CONTROVERSIAL);
      done();
    });
  });

  it('should update service when controversial is selected', (done: DoneFn) => {
    comp.selectRadioButton(BoostAudience.CONTROVERSIAL);

    (comp as any).service.audience$.subscribe((audience: BoostAudience) => {
      expect(audience).toBe(BoostAudience.CONTROVERSIAL);
      done();
    });
  });

  it('should have selected class when safe is selected', () => {
    comp.selectRadioButton(BoostAudience.SAFE);
    fixture.detectChanges();
    expect(getSelectedRadioButtonLabel().nativeElement.textContent).toBe(
      'Safe'
    );
  });

  it('should have selected class when controversial is selected', () => {
    comp.selectRadioButton(BoostAudience.CONTROVERSIAL);
    fixture.detectChanges();
    expect(getSelectedRadioButtonLabel().nativeElement.textContent).toBe(
      'Controversial'
    );
  });

  it('should default to controversial when safe boost is disabled', fakeAsync(() => {
    (comp as any).service.audience$.next(BoostAudience.SAFE);
    (comp as any).service.disabledSafeAudience$.next(true);

    comp.ngOnInit();
    tick();

    expect((comp as any).service.audience$.getValue()).toBe(
      BoostAudience.CONTROVERSIAL
    );
  }));

  it('should NOT default to controversial when safe boost is enabled', fakeAsync(() => {
    (comp as any).service.audience$.next(BoostAudience.SAFE);
    (comp as any).service.disabledSafeAudience$.next(false);

    comp.ngOnInit();
    tick();

    expect((comp as any).service.audience$.getValue()).toBe(BoostAudience.SAFE);
  }));
});
