import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ValuePropCardOutletComponent } from './outlet.component';
import { ValuePropService } from '../../services/value-prop.service';
import { MockService } from '../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { PresentableValuePropCard } from '../../value-prop.types';

let mockPresentableValuePropCard: PresentableValuePropCard = {
  title: 'Value prop card',
  imageUrl: 'https://example.minds.com/example.png',
  altText: 'Alt text',
  order: 0,
};

describe('ValuePropCardOutletComponent', () => {
  let comp: ValuePropCardOutletComponent;
  let fixture: ComponentFixture<ValuePropCardOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValuePropCardOutletComponent],
      providers: [
        {
          provide: ValuePropService,
          useValue: MockService(ValuePropService, {
            has: ['nextUnshownCard$'],
            props: {
              nextUnshownCard$: {
                get: () =>
                  new BehaviorSubject<PresentableValuePropCard>(
                    mockPresentableValuePropCard
                  ),
              },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ValuePropCardOutletComponent);
    comp = fixture.componentInstance;

    comp.showBorderTop = true;
    (comp as any).service.nextUnshownCard$.next(mockPresentableValuePropCard);
    comp.card$.next(null);

    fixture.detectChanges();
  });

  afterEach(() => {
    comp.ngOnDestroy();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should grab next unshown card from service and mark it as shown', fakeAsync(() => {
    (comp as any).service.nextUnshownCard$.next(mockPresentableValuePropCard);
    comp.card$.next(null);
    (comp as any).service.setCardAsShown.calls.reset();

    comp.ngOnInit();
    tick();

    expect(comp.card$.getValue()).toEqual(mockPresentableValuePropCard);
    expect((comp as any).service.setCardAsShown).toHaveBeenCalled();
  }));

  it('should not mark a null card as shown if there are no more to show', fakeAsync(() => {
    (comp as any).service.nextUnshownCard$.next(null);
    comp.card$.next(null);
    (comp as any).service.setCardAsShown.calls.reset();

    comp.ngOnInit();
    tick();

    expect(comp.card$.getValue()).toEqual(null);
    expect((comp as any).service.setCardAsShown).not.toHaveBeenCalled();
  }));
});
