import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BoostModalV2AudienceSelectorComponent } from './audience.component';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostAudience } from '../../boost-modal-v2.types';
import { MockService } from '../../../../../utils/mock';

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
        imports: [ReactiveFormsModule],
        declarations: [BoostModalV2AudienceSelectorComponent],
        providers: [
          {
            provide: BoostModalV2Service,
            useValue: MockService(BoostModalV2Service, {
              has: ['audience$'],
              props: {
                audience$: {
                  get: () =>
                    new BehaviorSubject<BoostAudience>(BoostAudience.SAFE),
                },
              },
            }),
          },
          FormBuilder,
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostModalV2AudienceSelectorComponent);
    comp = fixture.componentInstance;

    (comp as any).service.audience$.next(BoostAudience.SAFE);

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

  it('should update service when safe is selected', (done: DoneFn) => {
    comp.selectRadioButton(BoostAudience.SAFE);

    (comp as any).service.audience$.subscribe((audience: BoostAudience) => {
      expect(audience).toBe(BoostAudience.SAFE);
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
});
