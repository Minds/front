import {
  Component,
  Input,
  Inject,
  PLATFORM_ID,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import {
  Observable,
  Subject,
  combineLatest,
  Subscription,
  fromEvent,
  timer,
} from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import isMobile from '../../../helpers/is-mobile';
import * as Macy from 'macy';

@Component({
  selector: 'm-feedGrid',
  templateUrl: './feed-grid.component.html',
})
export class FeedGridComponent {
  @Input() maxColumns = 3;
  @Input('entities') entities: any[];

  windowResizeSubscription: Subscription;
  recalculateSubscription: Subscription;

  macyInstance: Macy;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.macyInstance = new Macy({
      container: this.elementRef.nativeElement,
      columns: this.maxColumns,
      trueOrder: true,
      margin: {
        x: 16,
        y: 16,
      },
      //mobileFirst: true,
      breakAt: {
        600: 1,
        900: 2,
        1028: 3,
      },
    });

    this.macyInstance.runOnImageLoad(() => {
      this.recalculate();
    }, true);

    if (isPlatformBrowser(this.platformId)) {
      this.recalculateSubscription = timer(0, 1000).subscribe(() =>
        this.recalculate()
      );
    }

    this.windowResizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.recalculate();
      });
  }

  ngAfterViewInit() {
    this.recalculate();
  }

  ngOnDestroy() {
    this.windowResizeSubscription.unsubscribe();
    if (this.recalculateSubscription) {
      this.recalculateSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes) {
    this.recalculate();
  }

  /**
   * This tells the macy library to recalculate all positions
   */
  recalculate(): void {
    if (!this.macyInstance) return;
    if (isPlatformServer(this.platformId)) return;
    setTimeout(() => this.macyInstance.recalculate(true));
  }
}
