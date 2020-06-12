/**
 * Carousel component for the horizontal display of channels and groups.
 *
 * This has been built to take the same objects returned by the latest channels / groups filters.
 * To implement you should get your feed of mixed content, and use rxjs to apply a higher order filter,
 * separating out the entities that should be displayed here (groups and or channels).
 * You should be able to use setEntities in the carouselEntitiesService to hold the value.
 *
 * Can contain a mixture of groups and channels, just groups or just channels.
 * @author Ben Hayward
 */
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import {
  CarouselEntitiesService,
  DisplayableEntity,
} from './carousel-entities.service';

@Component({
  selector: 'm-discovery__carousel',
  templateUrl: './carousel.component.html',
})
export class DiscoveryCarouselComponent implements AfterViewInit {
  private readonly cdnUrl: string;
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

  constructor(
    private configs: ConfigsService,
    private carouselEntitiesService: CarouselEntitiesService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getCarouselPositions();
  }

  /**
   * Gets BehaviorSubject observables.
   */
  get entities$(): BehaviorSubject<any[]> {
    return this.carouselEntitiesService.entities$;
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

  /**
   * Gets style for ngStyle - setting background image.
   * @param { DisplayableEntity } entity - entity to style.
   * @returns {{ 'background-image': string }} - style object.
   */
  public getStyle(entity: DisplayableEntity): { 'background-image': string } {
    return {
      'background-image':
        entity.type === 'group'
          ? 'url(' +
            this.cdnUrl +
            'fs/v1/avatars/' +
            entity.guid +
            '/medium/' +
            entity.icontime +
            ')'
          : 'url(' + this.cdnUrl + 'icon/' + entity.guid + ')',
    };
  }

  /**
   * Gets name from a given entity
   * @param { DisplayableEntity } entity - entity to get name from.
   * @returns { string } - entity name for display.
   */
  public getName(entity: DisplayableEntity): string {
    return entity.type === 'group' ? entity.name : '@' + entity.username;
  }

  /**
   * Gets the redirect link from a given entity
   * @param { DisplayableEntity } entity - entity to get redirect link from.
   * @returns { string } - redirect link for entity.
   */
  public getLink(entity: DisplayableEntity): string {
    return entity.type === 'group'
      ? '/groups/profile/' + entity.guid
      : '/' + entity.username;
  }

  /**
   * Gets button text from a given entity
   * @param { DisplayableEntity } entity - entity to get button text for.
   * @returns { string } - button text for entity.
   */
  public getButtonText(entity: DisplayableEntity): string {
    if (entity.type === 'group') {
      if (entity['is:member']) {
        return 'Joined';
      }
      return 'Join';
    }
    if (entity.type === 'user') {
      if (entity.subscribed) {
        return 'Subscribed';
      }
      return 'Subscribe';
    }
  }

  /**
   * Handles button click for an entity.
   * @param { DisplayableEntity } entity - the clicked buttons attached entity.
   * @returns { Promise<void> } - awaitable.
   */
  public async onButtonClick(entity: DisplayableEntity): Promise<void> {
    if (entity.type === 'group') {
      if (!entity['is:member']) {
        this.carouselEntitiesService.joinGroup(entity);
        return;
      }
      this.carouselEntitiesService.leaveGroup(entity);
      return;
    }
    if (entity.type === 'user') {
      if (!entity.subscribed) {
        this.carouselEntitiesService.subscribeToChannel(entity);
        return;
      }
      this.carouselEntitiesService.unsubscribeFromChannel(entity);
      return;
    }
  }
}
