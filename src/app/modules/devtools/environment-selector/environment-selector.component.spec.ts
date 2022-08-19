import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { EnvironmentSelectorComponent } from './environment-selector.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../utils/mock';
import { EnvironmentSelectorService } from './environment-selector.service';

describe('EnvironmentSelectorComponent', () => {
  let comp: EnvironmentSelectorComponent;
  let fixture: ComponentFixture<EnvironmentSelectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'm-button',
            inputs: ['size', 'color', 'saving', 'disabled'],
            outputs: ['onAction'],
          }),
          EnvironmentSelectorComponent,
        ],
        imports: [RouterTestingModule, ReactiveFormsModule],
        providers: [
          {
            provide: EnvironmentSelectorService,
            useValue: MockService(EnvironmentSelectorService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(EnvironmentSelectorComponent);

    comp = fixture.componentInstance;
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
    (comp as any).service.getCurrentEnvironment.and.returnValue('production');
    expect(comp).toBeTruthy();
  });

  it('should call to switch env to production', fakeAsync(() => {
    const env = 'production';
    (comp as any).form.controls.environment.setValue(env);

    comp.switchToEnvironment();
    tick();

    expect((comp as any).service.switchToEnvironment).toHaveBeenCalledWith(env);
  }));

  it('should call to switch env to canary', fakeAsync(() => {
    const env = 'canary';
    (comp as any).form.controls.environment.setValue(env);

    comp.switchToEnvironment();
    tick();

    expect((comp as any).service.switchToEnvironment).toHaveBeenCalledWith(env);
  }));

  it('should call to switch env to staging', fakeAsync(() => {
    const env = 'staging';
    (comp as any).form.controls.environment.setValue(env);

    comp.switchToEnvironment();
    tick();

    expect((comp as any).service.switchToEnvironment).toHaveBeenCalledWith(env);
  }));

  it('should determine if a user cannot submit because there is no form value', () => {
    (comp as any).form.controls.environment.setValue('production');
    (comp as any).inProgress = false;
    expect(comp.canSubmit()).toBe(true);
  });

  it('should determine if a user cannot submit because there is no form value', () => {
    (comp as any).form.controls.environment.setValue(null);
    expect(comp.canSubmit()).toBe(false);
  });

  it('should determine if a user cannot submit because a switch is in progress', () => {
    (comp as any).form.controls.environment.setValue('production');
    (comp as any).inProgress = true;
    expect(comp.canSubmit()).toBe(false);
  });
});
