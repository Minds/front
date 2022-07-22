import {
  Component,
  Input,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  ViewRef,
} from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { horizontallyScrollElementIntoView } from '../../../helpers/scrollable-container-visibility';

@Component({
  selector: 'm-dataTabsHeader',
  templateUrl: './data-tabs-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTabsHeaderComponent implements AfterViewInit {
  @Input() isScrollable: boolean = true;
  @Input() itemActivated;
  @ViewChild('dataTabsHeaderContainer')
  containerEl: ElementRef;
  container;
  public containerScrollLeft: number = 0;

  firstMetricEl;
  activeMetricEl;

  tabsArray;

  childClientWidth: number;
  faderWidthRight = 24;
  faderWidthLeft = 36;
  isOverflown: boolean = false;
  isAtScrollEnd = false;
  isAtScrollStart = true;
  showButton = { left: false, right: false };

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.container = this.containerEl.nativeElement;

        this.activeMetricEl = <HTMLElement>(
          document.querySelector('.active.m-dataTab')
        );

        this.firstMetricEl = <HTMLElement>document.querySelector('.m-dataTab');

        this.slideToActiveMetric(this.container, this.activeMetricEl);
        this.checkOverflow();
      }, 50);
    }
  }

  slideToActiveMetric(container, el) {
    horizontallyScrollElementIntoView(container, el, true);
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    const targetMetric = $event.target;
    if (targetMetric.className === 'm-dataTabsHeader__overflowFade--left') {
      this.slide('left');
    } else if (
      targetMetric.className === 'm-dataTabsHeader__overflowFade--right'
    ) {
      this.slide('right');
    } else {
      this.slideToActiveMetric(this.container, targetMetric);
      this.checkOverflow();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkOverflow();
  }

  onScroll($event) {
    this.containerScrollLeft = this.container.scrollLeft;
    this.checkOverflow();
  }

  checkOverflow() {
    // assumes all metrics are equal width
    if (!this.isScrollable || !this.container) {
      return;
    }

    this.firstMetricEl = <HTMLElement>document.querySelector('.m-dataTab');

    if (!this.firstMetricEl) {
      return;
    }

    this.childClientWidth = this.firstMetricEl.clientWidth;

    this.isOverflown =
      this.container.scrollWidth - this.container.clientWidth > 0;

    this.isAtScrollStart = this.container.scrollLeft < this.faderWidthLeft;
    this.showButton.left = this.isOverflown && !this.isAtScrollStart;

    this.isAtScrollEnd =
      !this.isOverflown ||
      this.container.scrollWidth -
        (this.container.scrollLeft + this.container.clientWidth) <
        this.faderWidthRight;

    this.showButton.right =
      this.isOverflown && this.container.scrollLeft >= 0 && !this.isAtScrollEnd;

    if (!(this.cd as ViewRef).destroyed) {
      this.detectChanges();
    }
  }

  slide(direction) {
    let currentScrollLeft = this.container.scrollLeft;
    let targetScrollLeft;
    let scrollEndOffset = 0;

    // console.log(this.container.clientWidth);
    const partiallyVisibleMetricWidth =
      this.container.clientWidth % this.childClientWidth;
    const completelyVisibleMetricsWidth =
      this.container.clientWidth - partiallyVisibleMetricWidth;

    if (direction === 'right') {
      if (currentScrollLeft < this.faderWidthRight) {
        currentScrollLeft = this.faderWidthRight;
      }
      targetScrollLeft = Math.min(
        currentScrollLeft + completelyVisibleMetricsWidth,
        this.container.scrollWidth - completelyVisibleMetricsWidth
      );
    } else {
      if (this.isAtScrollEnd) {
        scrollEndOffset = partiallyVisibleMetricWidth - this.faderWidthLeft;
      }
      targetScrollLeft = Math.max(
        currentScrollLeft - completelyVisibleMetricsWidth + scrollEndOffset,
        0
      );
    }

    this.container.scrollTo({
      top: 0,
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
