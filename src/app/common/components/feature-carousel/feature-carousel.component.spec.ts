import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CarouselItem,
  CarouselMoveDirection,
  FeatureCarouselComponent,
} from './feature-carousel.component';
import { FeatureCarouselService } from './feature-carousel.service';
import { MockService } from '../../../utils/mock';
import { BehaviorSubject, Subject, of, take } from 'rxjs';

describe('FeatureCarouselComponent', () => {
  let comp: FeatureCarouselComponent;
  let fixture: ComponentFixture<FeatureCarouselComponent>;

  const mockItems: CarouselItem[] = [
    {
      title: 'Item 1',
      media: {
        fullUrl: 'https://example.minds.com/image1.jpg',
        altText: 'Image 1',
      },
    },
    {
      title: 'Item 2',
      media: {
        fullUrl: 'https://example.minds.com/image2.jpg',
        altText: 'Image 2',
      },
    },
    {
      title: 'Item 3',
      media: {
        fullUrl: 'https://example.minds.com/image3.jpg',
      },
    },
  ];

  const mockCarouselItems$: BehaviorSubject<CarouselItem[]> =
    new BehaviorSubject<CarouselItem[]>(mockItems);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureCarouselComponent],
      providers: [
        {
          provide: FeatureCarouselService,
          useValue: MockService(FeatureCarouselComponent, {
            has: ['jumpToItemIndex$'],
            props: {
              jumpToItemIndex$: { get: () => new Subject<number>() },
            },
          }),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureCarouselComponent);
    comp = fixture.componentInstance;

    // readonly property so we have to do this to write.
    Object.defineProperty(comp, 'carouselItems$', {
      value: mockCarouselItems$,
    });
    comp.visibleCarouselIndex$.next(0);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should determine visible carousel item by index', (done: DoneFn) => {
    comp.visibleCarouselIndex$.next(1);

    comp.visibleCarouselItem$
      .pipe(take(1))
      .subscribe((carouselItem: CarouselItem) => {
        expect(carouselItem).toBe(mockItems[1]);
        done();
      });
  });

  it('should jump carousel to a specified index', (done: DoneFn) => {
    comp.visibleCarouselIndex$.next(0);
    (comp as any).service.jumpToItemIndex$.next(1);

    comp.visibleCarouselItem$
      .pipe(take(1))
      .subscribe((carouselItem: CarouselItem) => {
        expect(carouselItem).toBe(mockItems[1]);
        done();
      });
  });

  it('should move carousel forward', (done: DoneFn) => {
    comp.visibleCarouselIndex$.next(0);

    comp.moveCarousel(CarouselMoveDirection.FORWARD);

    comp.visibleCarouselItem$
      .pipe(take(1))
      .subscribe((carouselItem: CarouselItem) => {
        expect(carouselItem).toBe(mockItems[1]);
        done();
      });
  });

  it('should NOT move carousel forward when at end already', (done: DoneFn) => {
    comp.visibleCarouselIndex$.next(2);

    comp.moveCarousel(CarouselMoveDirection.FORWARD);

    comp.visibleCarouselItem$
      .pipe(take(1))
      .subscribe((carouselItem: CarouselItem) => {
        expect(carouselItem).toBe(mockItems[2]);
        done();
      });
  });

  it('should move carousel backward', (done: DoneFn) => {
    comp.visibleCarouselIndex$.next(1);

    comp.moveCarousel(CarouselMoveDirection.BACK);

    comp.visibleCarouselItem$
      .pipe(take(1))
      .subscribe((carouselItem: CarouselItem) => {
        expect(carouselItem).toBe(mockItems[0]);
        done();
      });
  });

  it('should NOT move carousel backward when at start already', (done: DoneFn) => {
    comp.visibleCarouselIndex$.next(0);

    comp.moveCarousel(CarouselMoveDirection.BACK);

    comp.visibleCarouselItem$
      .pipe(take(1))
      .subscribe((carouselItem: CarouselItem) => {
        expect(carouselItem).toBe(mockItems[0]);
        done();
      });
  });
});
