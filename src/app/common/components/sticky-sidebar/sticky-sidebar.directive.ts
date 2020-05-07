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

  scrollSubscription: Subscription;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.scrollSubscription = merge(
      fromEvent(window, 'scroll').pipe(debounceTime(100)),
      fromEvent(window, 'scroll').pipe(throttleTime(100))
    ).subscribe(() => {
      const windowHeight = window.innerHeight;
      const bounds = this.el.nativeElement.getBoundingClientRect();
      const yPos = bounds.y + TOPBAR_HEIGHT_PX;
      const distanceToBottom = windowHeight + yPos - bounds.height;
      if (distanceToBottom < 0) {
        // Make sticky
        const bottomOffset = windowHeight - bounds.height - TOPBAR_HEIGHT_PX;
        this.topPx = `${bottomOffset}px`;
      } else {
        // Make not sticky
        this.topPx = null;
      }
    });
  }
}
