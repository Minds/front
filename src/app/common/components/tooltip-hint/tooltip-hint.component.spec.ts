import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockService } from '../../../utils/mock';
import { TooltipHintComponent } from './tooltip-hint.component';
import { Storage } from '../../../services/storage';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';

describe('TooltipHintComponent', () => {
  let comp: TooltipHintComponent;
  let fixture: ComponentFixture<TooltipHintComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          TooltipHintComponent,
          MockComponent({
            selector: 'm-tooltip',
            inputs: [
              'anchor',
              'hidden',
              'enabled',
              'showArrow',
              'arrowOffset',
              'icon',
              'iconStyle',
              'tooltipBubbleStyle',
            ],
            outputs: ['click', 'tooltipMouseDown'],
          }),
        ],
        providers: [
          {
            provide: Storage,
            useValue: MockService(Storage),
          },
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(TooltipHintComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.shouldShow$.next(false);
    comp.tooltipHoverEnabled$.next(false);
    (comp as any).experiments.hasVariation.and.returnValue(true);

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

  it('should show tooltip on init if no local storage entry found and no experiment id is set', () => {
    expect(comp.shouldShow$.getValue()).toBe(false);

    (comp as any).storage.get.calls.reset();
    (comp as any).storage.set.calls.reset();
    (comp as any).storage.get.and.returnValue(false);

    const storageKeyPrefix = 'example-component';
    const fullStorageKey = `${storageKeyPrefix}:shown`;

    comp.storageKeyPrefix = storageKeyPrefix;

    comp.ngOnInit();

    expect((comp as any).storage.get).toHaveBeenCalledWith(fullStorageKey);
    expect((comp as any).storage.set).toHaveBeenCalledWith(fullStorageKey, 1);
    expect(comp.tooltipHoverEnabled$.getValue()).toBeFalse();
    expect(comp.shouldShow$.getValue()).toBeTrue();
  });

  it('should NOT show tooltip on init if local storage entry found and no experiment id is set', () => {
    expect(comp.shouldShow$.getValue()).toBe(false);

    (comp as any).storage.get.calls.reset();
    (comp as any).storage.set.calls.reset();
    (comp as any).storage.get.and.returnValue(true);

    const storageKeyPrefix = 'example-component';
    const fullStorageKey = `${storageKeyPrefix}:shown`;

    comp.storageKeyPrefix = storageKeyPrefix;

    comp.ngOnInit();

    expect((comp as any).storage.get).toHaveBeenCalledWith(fullStorageKey);
    expect((comp as any).storage.set).not.toHaveBeenCalledWith(
      fullStorageKey,
      1
    );
    expect(comp.shouldShow$.getValue()).toBeFalse();
    expect(comp.tooltipHoverEnabled$.getValue()).toBeTrue();
  });

  it('should show tooltip on init if no local storage entry found and experiment is active', () => {
    expect(comp.shouldShow$.getValue()).toBe(false);
    (comp as any).experiments.hasVariation.and.returnValue(true);
    (comp as any).storage.get.calls.reset();
    (comp as any).storage.set.calls.reset();
    (comp as any).storage.get.and.returnValue(false);

    const storageKeyPrefix = 'example-component';
    const fullStorageKey = `${storageKeyPrefix}:shown`;
    const experimentId = '~exp_id~';

    comp.storageKeyPrefix = storageKeyPrefix;
    comp.experimentId = experimentId;
    comp.ngOnInit();

    expect((comp as any).experiments.hasVariation).toHaveBeenCalledWith(
      experimentId,
      true
    );
    expect((comp as any).storage.get).toHaveBeenCalledWith(fullStorageKey);
    expect((comp as any).storage.set).toHaveBeenCalledWith(fullStorageKey, 1);
    expect(comp.shouldShow$.getValue()).toBeTrue();
  });

  it('should NOT show tooltip on init if local storage entry found and experiment is active', () => {
    expect(comp.shouldShow$.getValue()).toBe(false);
    (comp as any).experiments.hasVariation.and.returnValue(true);
    (comp as any).storage.get.calls.reset();
    (comp as any).storage.set.calls.reset();
    (comp as any).storage.get.and.returnValue(true);

    const storageKeyPrefix = 'example-component';
    const fullStorageKey = `${storageKeyPrefix}:shown`;
    const experimentId = '~exp_id~';

    comp.storageKeyPrefix = storageKeyPrefix;
    comp.experimentId = experimentId;

    comp.ngOnInit();

    expect((comp as any).experiments.hasVariation).toHaveBeenCalledWith(
      experimentId,
      true
    );
    expect((comp as any).storage.get).toHaveBeenCalledWith(fullStorageKey);
    expect((comp as any).storage.set).not.toHaveBeenCalledWith(
      fullStorageKey,
      1
    );
    expect(comp.shouldShow$.getValue()).toBeFalse();
  });

  it('should NOT show tooltip on init and set hover value to true if experiment exists but is off', () => {
    expect(comp.shouldShow$.getValue()).toBe(false);
    (comp as any).experiments.hasVariation.and.returnValue(false);
    (comp as any).storage.get.calls.reset();
    (comp as any).storage.set.calls.reset();

    const storageKeyPrefix = 'example-component';
    const fullStorageKey = `${storageKeyPrefix}:shown`;
    const experimentId = '~exp_id~';

    comp.storageKeyPrefix = storageKeyPrefix;
    comp.experimentId = experimentId;

    comp.ngOnInit();

    expect((comp as any).experiments.hasVariation).toHaveBeenCalledWith(
      experimentId,
      true
    );
    expect((comp as any).storage.get).not.toHaveBeenCalledWith(fullStorageKey);
    expect((comp as any).storage.set).not.toHaveBeenCalledWith(
      fullStorageKey,
      1
    );
    expect(comp.shouldShow$.getValue()).toBeFalse();
    expect(comp.tooltipHoverEnabled$.getValue()).toBeTrue();
  });

  it('should state appropriately on click', () => {
    comp.shouldShow$.next(true);
    comp.tooltipHoverEnabled$.next(false);

    comp.onClick();

    expect(comp.shouldShow$.getValue()).toBeFalse();
    expect(comp.tooltipHoverEnabled$.getValue()).toBeTrue();
  });
});
