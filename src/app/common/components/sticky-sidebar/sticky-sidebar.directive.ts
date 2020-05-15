import {
  Directive,
  AfterViewInit,
  HostBinding,
  ElementRef,
  OnInit,
} from '@angular/core';
import { fromEvent, Subscription, merge } from 'rxjs';
import { throttleTime, debounceTime, debounce } from 'rxjs/operators';

const TOPBAR_HEIGHT_PX = 75;

@Directive({
  selector: '[m-stickySidebar]',
})
export class StickySidebarDirective implements OnInit, AfterViewInit {
  @HostBinding('style.position')
  readonly position = 'sticky';

  @HostBinding('style.top') topPx: string;

  private initialOffsetFromTop = 0;

  scrollSubscription: Subscription;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initialOffsetFromTop = this.el.nativeElement.getBoundingClientRect().y;
    this.scrollSubscription = merge(
      fromEvent(window, 'scroll').pipe(debounceTime(100)),
      fromEvent(window, 'scroll').pipe(throttleTime(100))
    ).subscribe(() => {
      const windowHeight = window.innerHeight;
      const bounds = this.el.nativeElement.getBoundingClientRect();
      const yPos = bounds.y + TOPBAR_HEIGHT_PX;
      const distanceToBottom = windowHeight + yPos - bounds.height;

      // console.log(windowHeight, bounds.height, this.initialOffsetFromTop);
      if (distanceToBottom < 0) {
        // Make sticky
        const bottomOffset = windowHeight - bounds.height - TOPBAR_HEIGHT_PX;
        this.topPx = `${bottomOffset}px`;
      } else if (windowHeight > bounds.height) {
        // Keep above top bar
        // this.topPx = this.initialOffsetFromTop + 'px';
        this.topPx = TOPBAR_HEIGHT_PX + 20 + 'px';
      } else {
        // Make not sticky ?
        this.topPx = 0 + 'px';
      }
    });
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
