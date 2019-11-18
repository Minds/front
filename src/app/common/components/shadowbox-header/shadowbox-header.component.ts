import {
  Component,
  Input,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'm-shadowboxHeader',
  templateUrl: './shadowbox-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShadowboxHeaderComponent implements AfterViewInit {
  @Input() isScrollable: boolean = true;
  @Input() metricActivated;
  @ViewChild('shadowboxHeaderContainer', { static: false })
  shadowboxHeaderContainerEl: ElementRef;
  shadowboxHeaderContainer;

  childClientWidth: number;
  faderWidth = 24;
  isOverflown: boolean = false;
  isAtScrollEnd = false;
  isAtScrollStart = true;
  showButton = { left: false, right: false };

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.checkOverflow();
    // const activeMetric = ;//get the index of the metric with .active
    // this.slideToActiveMetric();
  }

  // updateMetric(metric) {
  //   // TODO: if clicked metric is not fully visible, slide() until it is
  //   this.analyticsService.updateMetric(metric.id);
  // }

  // ----------------------------------------------------
  @HostListener('click', ['$event.target'])
  onClick(target) {
    console.log('***Clicked on: ', target);
    // this.slideToActiveMetric(metricIndex);
  }

  slideToActiveMetric(metricIndex) {
    // TODOOJM
  }
  // ----------------------------------------------------

  @HostListener('window:resize')
  onResize() {
    this.checkOverflow();
  }

  onScroll($event) {
    this.checkOverflow();
  }

  checkOverflow() {
    if (!this.isScrollable) {
      return;
    }

    const firstMetric = <HTMLElement>(
      document.querySelector('.m-shadowboxLayout__headerItem')
    );
    // TODO: figure out how to avoid test failure "Cannot read property 'clientWidth' of null"
    this.childClientWidth = firstMetric ? firstMetric.clientWidth : 160;

    this.shadowboxHeaderContainer = this.shadowboxHeaderContainerEl.nativeElement;
    this.isOverflown =
      this.shadowboxHeaderContainer.scrollWidth -
        this.shadowboxHeaderContainer.clientWidth >
      0;

    this.isAtScrollStart =
      this.shadowboxHeaderContainer.scrollLeft < this.faderWidth;
    this.showButton.left = this.isOverflown && !this.isAtScrollStart;

    this.isAtScrollEnd =
      !this.isOverflown ||
      this.shadowboxHeaderContainer.scrollWidth -
        (this.shadowboxHeaderContainer.scrollLeft +
          this.shadowboxHeaderContainer.clientWidth) <
        this.faderWidth;

    this.showButton.right =
      this.isOverflown &&
      this.shadowboxHeaderContainer.scrollLeft >= 0 &&
      !this.isAtScrollEnd;
    this.detectChanges();
  }

  slide(direction) {
    let currentScrollLeft = this.shadowboxHeaderContainer.scrollLeft;
    let targetScrollLeft;
    let scrollEndOffset = 0;
    const partiallyVisibleMetricWidth =
      this.shadowboxHeaderContainer.clientWidth % this.childClientWidth;
    const completelyVisibleMetricsWidth =
      this.shadowboxHeaderContainer.clientWidth - partiallyVisibleMetricWidth;

    if (direction === 'right') {
      if (currentScrollLeft < this.faderWidth) {
        currentScrollLeft = this.faderWidth;
      }
      targetScrollLeft = Math.min(
        currentScrollLeft + completelyVisibleMetricsWidth,
        this.shadowboxHeaderContainer.scrollWidth -
          completelyVisibleMetricsWidth
      );
    } else {
      if (this.isAtScrollEnd) {
        scrollEndOffset = partiallyVisibleMetricWidth - this.faderWidth;
      }
      targetScrollLeft = Math.max(
        currentScrollLeft - completelyVisibleMetricsWidth + scrollEndOffset,
        0
      );
    }

    this.shadowboxHeaderContainer.scrollTo({
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
