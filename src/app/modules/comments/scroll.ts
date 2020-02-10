import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[commentsScroll]',
  inputs: ['_emitter: emitter', 'enabled'],
  outputs: ['previous', 'next'],
  exportAs: 'commentsScroll',
})
export class CommentsScrollDirective {
  emitter: EventEmitter<any>;
  enabled: boolean = true;
  previous: EventEmitter<any> = new EventEmitter();
  next: EventEmitter<any> = new EventEmitter();

  private DEBOUNCE_TIME_MS = 1000 / 30; // fps
  private STICK_INTERVAL_MS = this.DEBOUNCE_TIME_MS * 30; // frames
  private SCROLL_THRESHOLD = 12; // pixels

  private scroll: Observable<any>;
  private scrollSubscription: Subscription;
  private stickInterval: any;
  private stickTo: string;

  private emitterSubscription: Subscription;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.scroll = fromEvent(elementRef.nativeElement, 'scroll');
  }

  set _emitter(emitter: EventEmitter<any>) {
    if (!(emitter instanceof EventEmitter)) {
      console.error('Not an emitter');
      return;
    }

    if (isPlatformServer(this.platformId)) return;

    if (this.emitterSubscription) {
      this.emitterSubscription.unsubscribe();
    }

    this.emitterSubscription = emitter.subscribe((command: string) => {
      setTimeout(() => {
        switch (command) {
          case 'top':
            this.top(true, true);
            break;

          case 'bottom':
            this.bottom(true, true);
            break;
        }
      }, this.DEBOUNCE_TIME_MS);
    });
  }

  ngOnInit() {
    this.scrollSubscription = this.scroll
      .pipe(debounceTime(this.DEBOUNCE_TIME_MS / 5))
      .subscribe((event: Event) => this.run(event));

    this.setStick();
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }

    if (this.emitterSubscription) {
      this.emitterSubscription.unsubscribe();
    }

    if (this.stickInterval) {
      clearInterval(this.stickInterval);
    }
  }

  run(event?: Event) {
    let el: any = this.elementRef.nativeElement;

    if (el.scrollTop <= this.SCROLL_THRESHOLD) {
      this.previous.emit(true);
    }

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
      this.next.emit(true);
    } else {
      this.setStick(null);
    }
  }

  stick() {
    if (!this.stickTo) {
      return;
    }

    switch (this.stickTo) {
      case 'top':
        this.top();
        break;

      case 'bottom':
        this.bottom();
        break;
    }
  }

  setStick(value?: string) {
    if (value || value === null) {
      this.stickTo = value;
    }

    // Refresh timer
    if (this.stickInterval) {
      clearInterval(this.stickInterval);
    }
    if (isPlatformBrowser(this.platformId))
      this.stickInterval = setInterval(
        () => this.stick(),
        this.STICK_INTERVAL_MS
      );
  }

  top(run?: boolean, stick?: boolean) {
    if (this.enabled) {
      this.elementRef.nativeElement.scrollTop = 0;

      if (stick) {
        this.setStick('top');
      }

      if (run) {
        this.run();
      }
    }
  }

  bottom(run?: boolean, stick?: boolean) {
    if (this.enabled) {
      this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;

      if (stick) {
        this.setStick('bottom');
      }

      if (run) {
        this.run();
      }
    }
  }
}
