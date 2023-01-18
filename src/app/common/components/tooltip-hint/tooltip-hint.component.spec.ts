import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockService } from '../../../utils/mock';
import { TooltipHintComponent } from './tooltip-hint.component';
import { Storage } from '../../../services/storage';

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

  it('should get and set tooltip style', () => {
    comp.tooltipBubbleStyle = {
      display: 'none',
    };
    expect(comp.tooltipBubbleStyle).toEqual({
      right: '-5px',
      display: 'none',
    });
  });

  it('should show tooltip on init if no local storage entry found', () => {
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
    expect(comp.shouldShow$.getValue()).toBe(true);
  });

  it('should NOT show tooltip on init if local storage entry found', () => {
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
    expect(comp.shouldShow$.getValue()).toBe(false);
  });

  it('should state appropriately on click', () => {
    comp.shouldShow$.next(true);
    comp.tooltipHoverEnabled$.next(false);

    comp.onClick();

    expect(comp.shouldShow$.getValue()).toBeFalse();
    expect(comp.tooltipHoverEnabled$.getValue()).toBeTrue();
  });
});
