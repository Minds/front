import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NetworkAdminConsoleRadioBoxComponent } from './radio-box.component';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MockService } from '../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';

describe('NetworkAdminConsoleRadioBoxComponent', () => {
  let comp: NetworkAdminConsoleRadioBoxComponent<unknown>;
  let fixture: ComponentFixture<NetworkAdminConsoleRadioBoxComponent<unknown>>;

  const controlValue$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(
    false
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NetworkAdminConsoleRadioBoxComponent,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [{ provide: NgControl, useValue: NgControl }],
    }).overrideComponent(NetworkAdminConsoleRadioBoxComponent, {
      set: {
        providers: [
          {
            provide: NgControl,
            useValue: MockService(NgControl, {
              has: ['valueAccessor', 'control'],
              props: {
                valueAccessor: {
                  get: () => this,
                  set: () => {},
                },
                control: {
                  get: () => {
                    return {
                      valueChanges: controlValue$,
                    };
                  },
                },
              },
            }),
          },
        ],
      },
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleRadioBoxComponent);
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should write value', fakeAsync(() => {
    comp.controlValue = false;
    comp.writeValue(true);
    expect(comp.controlValue).toBe(true);
  }));

  describe('onClick', () => {
    it('should fire onchange function on click', () => {
      spyOn(comp, 'onChange');
      comp.saving = false;
      comp.controlValue = true;
      comp.inputValue = false;

      comp.onClick();

      expect(comp.onChange).toHaveBeenCalledWith(false);
    });

    it('should NOT fire onchange function on click when saving', () => {
      spyOn(comp, 'onChange');
      comp.saving = true;
      comp.controlValue = true;
      comp.inputValue = false;

      comp.onClick();

      expect(comp.onChange).not.toHaveBeenCalled();
    });

    it('should NOT fire onchange function on click when control value and input value match', () => {
      spyOn(comp, 'onChange');
      comp.saving = false;
      comp.controlValue = true;
      comp.inputValue = true;

      comp.onClick();

      expect(comp.onChange).not.toHaveBeenCalled();
    });
  });
});
