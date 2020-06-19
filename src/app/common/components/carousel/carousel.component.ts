/**
 * Carousel component.
 *
 * To implement, pass entities to setEntities of the service and remove the
 * entities$ placeholder. This has been built to initially take the same objects
 * returned by the latest channels / groups filters. To implement you should get
 * your feed of mixed content, and use rxjs to apply a higher order filter,
 * separating out the entities that should be displayed here.
 *
 * @author Ben Hayward
 */
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  Input,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CarouselEntitiesService } from './carousel-entities.service';
import { Dimensions } from './card/carousel-card.component';
import { isPlatformBrowser } from '@angular/common';

export type Direction = 'left' | 'right';

@Component({
  selector: 'm-carousel',
  templateUrl: './carousel.component.html',
})
export class CarouselComponent implements AfterViewInit {
  private container: Element; // holds nativeElement.
  private childWidth: number; // actual child width.
  public atBoundary: Direction; // left, right.
  public isOverflown: boolean = false; // true if is overflown.

  /**
   * Set the width of the card
   */
  @Input() cardDimensions: Dimensions = {
    width: 130,
    height: 166,
  };

  /**
   * Set value in service to entities$
   */
  @Input() set entities$(value$: BehaviorSubject<any[]>) {
    // TODO: Pass in live entities and remove test ones from service.
    this.service.setEntities(value$);
  }

  /**
   * Carousel ViewChild.
   */
  @ViewChild('carousel') containerEl: ElementRef;

  /**
   * Reload on resize.
   */
  @HostListener('window:resize')
  onResize() {
    this.onLoad();
  }

  /**
   * Gets BehaviorSubject observables.
   */
  get entities$(): BehaviorSubject<any[]> {
    return this.service.entities$;
  }

  constructor(
    public service: CarouselEntitiesService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.onLoad();
      }, 50);
    }
  }

  /**
   * Reload on scroll.
   * @param $event
   */
  onScroll() {
    this.atBoundary = null;
    this.checkBoundaries('left');
    this.checkBoundaries('right');
  }

  /**
   * Re-init dynamic variables.
   */
  onLoad() {
    this.container = this.containerEl.nativeElement;

    // assumes all metrics are equal width
    if (!this.container) {
      return;
    }

    const firstElement = <HTMLElement>(
      document.querySelector('.m-carousel__item')
    );

    if (!firstElement) {
      return;
    }

    this.childWidth = firstElement.clientWidth;

    this.isOverflown =
      this.container.scrollWidth - this.container.clientWidth > 0;

    this.checkBoundaries('left');
  }

  /**
   * Slides the carousel left or right.
   * @param { string } direction - left or right
   */
  async slide(direction: Direction) {
    const scrollAmount =
      this.container.clientWidth -
      (this.container.clientWidth % this.childWidth);

    this.atBoundary = null;
    this.checkBoundaries(direction, scrollAmount);

    if (direction === 'right') {
      this.container.scrollLeft += scrollAmount;
    } else {
      this.container.scrollLeft -= scrollAmount;
    }
  }

  /**
   * Checks whether the carousels scroll is against a boundary.
   * @param { Direction } direction - check left or right boundary.
   * @param scrollAmount - check after applying the scrollAmount.
   */
  async checkBoundaries(
    direction: Direction,
    scrollAmount: number = 0
  ): Promise<void> {
    if (
      direction === 'left' &&
      this.container.scrollLeft - Math.floor(scrollAmount) <= 0
    ) {
      this.atBoundary = 'left';
    }

    if (
      direction === 'right' &&
      this.container.scrollLeft + scrollAmount >=
        this.container.scrollWidth - this.container.clientWidth
    ) {
      this.atBoundary = 'right';
    }
  }
}
