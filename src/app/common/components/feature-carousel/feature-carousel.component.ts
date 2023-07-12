import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FeatureCarouselService } from './feature-carousel.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  map,
  take,
} from 'rxjs';

/**
 * Item for display in the carousel.
 */
export type CarouselItem = {
  title: string;
  media: {
    fullUrl: string;
    altText?: string;
  };
};

/**
 * Move direction for carousel.
 */
export enum CarouselMoveDirection {
  BACK,
  FORWARD,
}

/**
 * Carousel that shows a list of items and allows the user to navigate between them.
 */
@Component({
  selector: 'm-featureCarousel',
  templateUrl: './feature-carousel.component.html',
  styleUrls: ['feature-carousel.component.ng.scss'],
})
export class FeatureCarouselComponent implements OnInit, OnDestroy {
  /** Move direction for carousel. */
  public readonly CarouselMoveDirection: typeof CarouselMoveDirection = CarouselMoveDirection;

  /** Items to be shown in carousel. */
  @Input() public readonly carouselItems$: Observable<CarouselItem[]>;

  /** Index of currently visible carousel item. */
  public readonly visibleCarouselIndex$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(0);

  /** Currently visible carousel item */
  public visibleCarouselItem$: Observable<CarouselItem>;

  // subscriptions.
  private carouselMoveSubscription: Subscription;
  private jumpToItemIndexSubscription: Subscription;
  private jumpCarouselSubscription: Subscription;

  constructor(private service: FeatureCarouselService) {}

  ngOnInit(): void {
    // set visible carousel item observable, from carousel items and visible item index.
    this.visibleCarouselItem$ = combineLatest([
      this.carouselItems$,
      this.visibleCarouselIndex$,
    ]).pipe(
      map(([carouselItems, visibleCarouselIndex]) => {
        return carouselItems[visibleCarouselIndex] ?? carouselItems[0];
      })
    );

    // subscription so that external components can jump the carousel to specific indexes.
    this.jumpToItemIndexSubscription = this.service.jumpToItemIndex$.subscribe(
      index => {
        this.jumpCarousel(index);
      }
    );
  }

  ngOnDestroy(): void {
    this.carouselMoveSubscription?.unsubscribe();
    this.jumpCarouselSubscription?.unsubscribe();
    this.jumpToItemIndexSubscription?.unsubscribe();
  }

  /**
   * Move the carousel in a specified direction.
   * @param { CarouselMoveDirection } direction - direction to move.
   * @returns { void }
   */
  public moveCarousel(direction: CarouselMoveDirection): void {
    this.carouselMoveSubscription?.unsubscribe();

    this.carouselMoveSubscription = combineLatest([
      this.carouselItems$,
      this.visibleCarouselIndex$,
    ])
      .pipe(take(1))
      .subscribe(
        ([carouselItems, visibleCarouselIndex]: [
          CarouselItem[],
          number
        ]): void => {
          let nextIndex: number;

          if (direction === CarouselMoveDirection.FORWARD) {
            nextIndex = ++visibleCarouselIndex;
            if (nextIndex > carouselItems.length - 1) {
              return;
            }
          } else {
            nextIndex = --visibleCarouselIndex;
            if (nextIndex < 0) {
              return;
            }
          }

          this.visibleCarouselIndex$.next(nextIndex);
        }
      );
  }

  /**
   * Jump carousel to a specified index.
   * @returns { void }
   */
  public jumpCarousel(index: number): void {
    this.jumpCarouselSubscription = this.carouselItems$
      .pipe(take(1))
      .subscribe((items: CarouselItem[]) => {
        if (items[index] !== undefined) {
          this.visibleCarouselIndex$.next(index);
        }
      });
  }
}
