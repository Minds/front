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
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CarouselEntitiesService } from './carousel-entities.service';

@Component({
  selector: 'm-carousel',
  templateUrl: './carousel.component.html',
})
export class CarouselComponent implements AfterViewInit {
  private carouselPositions: number[][]; // stores positions of elements
  private halfContainerWidth: number; // half of container width
  private currentItemIndex: number = 0; // item index

  /**
   * Carousel object.
   */
  @ViewChild('carousel') carousel: ElementRef<any>;

  /**
   * Recalculate carousel positions on resize.
   */
  @HostListener('window:resize') onWindowResize() {
    this.getCarouselPositions();
  }

  /**
   * Set value in service to entities$
   */
  @Input() set entities$(value$: BehaviorSubject<any[]>) {
    // TODO: Pass in live entities and remove test ones from service.
    this.service.setEntities(value$);
  }

  /**
   * Gets BehaviorSubject observables.
   */
  get entities$(): BehaviorSubject<any[]> {
    return this.service.entities$;
  }

  constructor(public service: CarouselEntitiesService) {}

  async ngAfterViewInit(): Promise<void> {
    await this.getCarouselPositions();
  }

  /**
   * Populates array of [x, y] coordinates of the carousel elements.
   * And sets half container width.
   * @returns { Promise<void> }
   */
  private async getCarouselPositions(): Promise<void> {
    this.carouselPositions = [];
    for (const div of [...this.carousel.nativeElement.children]) {
      this.carouselPositions.push([
        div.offsetLeft,
        div.offsetLeft + div.offsetWidth,
      ]);
    }
    this.halfContainerWidth = this.carousel.nativeElement.offsetWidth / 2;
  }

  /**
   * Moves carousel either left or right
   * @param { string } direction - 'left' or 'right'.
   * @returns { Promise<void> }
   * Adapted from @sebastienbarbier 's solution here.
   * https://stackoverflow.com/a/57533033/7396007
   */
  public async goCarousel(direction: string): Promise<void> {
    const { nativeElement } = this.carousel;
    const currentScrollLeft = nativeElement.scrollLeft;
    const currentScrollRight = currentScrollLeft + nativeElement.offsetWidth;

    if (currentScrollLeft === 0 && direction === 'next') {
      this.currentItemIndex = 1;
    } else if (
      currentScrollRight === nativeElement.scrollWidth &&
      direction === 'previous'
    ) {
      this.currentItemIndex = this.carouselPositions.length - 2;
    } else {
      const currentMiddlePosition = currentScrollLeft + this.halfContainerWidth;
      for (let i = 0; i < this.carouselPositions.length; i++) {
        if (
          currentMiddlePosition > this.carouselPositions[i][0] &&
          currentMiddlePosition < this.carouselPositions[i][1]
        ) {
          this.currentItemIndex = i;
          if (direction === 'next') {
            this.currentItemIndex++;
          } else if (direction === 'previous') {
            this.currentItemIndex--;
          }
        }
      }
    }

    nativeElement.scrollTo({
      left: this.carouselPositions[this.currentItemIndex][0],
      behavior: 'smooth',
    });
  }
}
