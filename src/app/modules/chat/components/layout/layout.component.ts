import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { TopbarAlertService } from '../../../../common/components/topbar-alert/topbar-alert.service';

/** Width to consider the component in "narrow viewport" mode. */
const NARROW_VIEWPORT_WIDTH: string = '1040px'; // $layoutMin3ColWidth

/**
 * Page layout component for chat. Expects two projected content areas, "left" and optionally, "right".
 * Will display both in fullscreen, and right panel only in narrow viewports if set, and `fullWidthOnly` is not
 * true in route data.
 */
@Component({
  selector: 'm-chat__pageLayout',
  styleUrls: ['./layout.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule],
  standalone: true,
  template: `
    <ng-container *ngIf="initialized$ | async">
      <!-- Full width viewport -->
      <div
        class="m-chat__pageLayoutContainer--left"
        *ngIf="
          !(isNarrowViewport$ | async) || (fullWidthOnlyChildRoute$ | async)
        "
      >
        <ng-content select="[left]"></ng-content>
      </div>
      <div
        class="m-chat__pageLayoutContainer--right"
        *ngIf="
          !(isNarrowViewport$ | async) || !(fullWidthOnlyChildRoute$ | async)
        "
      >
        <ng-content select="[right]"></ng-content>
      </div>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ChatPageLayoutComponent implements OnInit, OnDestroy {
  /**
   * Whether the child route should only be rendered when full width.
   */
  protected fullWidthOnlyChildRoute$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /**
   * Whether the component has been initialized.
   */
  protected initialized$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Whether the viewport is to be considered narrow.
   */
  protected isNarrowViewport$: Observable<
    boolean
  > = this.breakpointObserver
    .observe([`(max-width: ${NARROW_VIEWPORT_WIDTH})`])
    .pipe(map((result: any) => result.matches));

  // subscriptions.
  private routerEventSubscription: Subscription;
  private topbarAlertSubscription: Subscription;

  @HostBinding('class.m-chat__pageLayout--hasTopbarAlert')
  protected hasTopbarAlert: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private topbarAlertService: TopbarAlertService
  ) {}

  ngOnInit(): void {
    this.fullWidthOnlyChildRoute$.next(
      this.route.snapshot.firstChild?.data?.fullWidthOnly
    );

    if (!this.initialized$.getValue()) {
      this.initialized$.next(true);
    }

    this.topbarAlertSubscription = this.topbarAlertService.shouldShow$.subscribe(
      (shouldShow: boolean) => {
        this.hasTopbarAlert = shouldShow;
      }
    );
  }

  ngOnDestroy(): void {
    this.routerEventSubscription?.unsubscribe();
    this.topbarAlertSubscription?.unsubscribe();
  }
}
