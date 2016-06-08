import { Directive, EventEmitter, ElementRef } from 'angular2/core';
import { Observable, Subscription } from 'rxjs/Rx';

@Directive({
  selector: '[commentsScroll]',
  inputs: [ '_emitter: emitter' ],
  outputs: [ 'previous', 'next' ],
  exportAs: 'commentsScroll'
})
export class CommentsScrollDirective {
  private DEBOUNCE_TIME = 100;
  private SCROLL_THRESHOLD = 200; // pixels

  private scroll: Observable<any>;
  private scrollSubscription: Subscription; 
  
  emitter: EventEmitter<string>;
  previous: EventEmitter<any> = new EventEmitter();
  next: EventEmitter<any> = new EventEmitter();

  private emitterSubscription: Subscription;

  constructor(private elementRef: ElementRef) {
    this.scroll = Observable.fromEvent(elementRef.nativeElement, 'scroll');
  }

  set _emitter(emitter: EventEmitter<string>) {
    if (!(emitter instanceof EventEmitter)) {
      console.error('Not an emitter');
      return;
    }

    if (this.emitterSubscription) {
      this.emitterSubscription.unsubscribe();
    }

    this.emitterSubscription = emitter.subscribe((command: string) => {
      setTimeout(() => {
        switch (command) {
          case 'top':
            this.top();
            break;
          
          case 'bottom':
            this.bottom();
            break;
        }
      }, this.DEBOUNCE_TIME);
    });
  }

  ngOnInit() {
    this.scrollSubscription = this.scroll
      .debounceTime(this.DEBOUNCE_TIME)
      .subscribe((event: Event) => this.run(event));
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }

    if (this.emitterSubscription) {
      this.emitterSubscription.unsubscribe();
    }
  }

  run(event?: Event) {
    let el: any = this.elementRef.nativeElement;

    if (el.scrollTop <= this.SCROLL_THRESHOLD) {
      this.previous.emit(true);
    }

    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - this.SCROLL_THRESHOLD
    ) {
      this.next.emit(true);
    }
  }

  top(run?: boolean) {
    this.elementRef.nativeElement.scrollTop = 0;

    if (run) {
      this.run();
    }
  }

  bottom(run?: boolean) {
    this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;

    if (run) {
      this.run();
    }
  }
}