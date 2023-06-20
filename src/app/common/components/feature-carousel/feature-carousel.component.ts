import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  map,
  of,
  take,
} from 'rxjs';
import { FeaturedContentService } from '../featured-content/featured-content.service';
import { FeatureCarouselService } from './feature-carousel.service';

export type CarouselItem = {
  title: string;
  media: {
    fullUrl: string;
    altText?: string;
  };
};

enum CarouselMoveDirection {
  BACK,
  FORWARD,
}

@Component({
  selector: 'm-featureCarousel',
  templateUrl: './feature-carousel.component.html',
  styleUrls: ['feature-carousel.component.ng.scss'],
})
export class FeatureCarouselComponent implements OnInit, OnDestroy {
  public readonly CarouselMoveDirection: typeof CarouselMoveDirection = CarouselMoveDirection;

  @Input() public readonly carouselItems$: Observable<CarouselItem[]>;

  public readonly visibleCarouselIndex$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(0);

  public visibleCarouselItem$: Observable<CarouselItem>;

  private carouselMoveSubscription: Subscription;
  private jumpToItemIndexSubscription: Subscription;
  private jumpCarouselSubscription: Subscription;

  constructor(private service: FeatureCarouselService) {}

  ngOnInit(): void {
    this.visibleCarouselItem$ = combineLatest([
      this.carouselItems$,
      this.visibleCarouselIndex$,
    ]).pipe(
      map(([carouselItems, visibleCarouselIndex]) => {
        return carouselItems[visibleCarouselIndex] ?? carouselItems[0];
      })
    );

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

  public moveCarousel(direction: CarouselMoveDirection): void {
    this.carouselMoveSubscription?.unsubscribe();

    combineLatest([this.carouselItems$, this.visibleCarouselIndex$])
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
