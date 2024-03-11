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
const NARROW_VIEWPORT_WIDTH: string = '1040px';

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
      <ng-container
        *ngIf="!(isNarrowViewport$ | async); else narrowViewportTemplate"
      >
        <div class="m-chat__pageLayoutContainer--left">
          <ng-template *ngTemplateOutlet="leftContent"></ng-template>
        </div>
        <div class="m-chat__pageLayoutContainer--right">
          <ng-template *ngTemplateOutlet="rightContent"></ng-template>
        </div>
      </ng-container>
      <!-- Narrow viewport -->
      <ng-template #narrowViewportTemplate>
        <!--If the child route should only be rendered when full width, show the rooms list instead -->
        <ng-container
          *ngIf="!(fullWidthOnlyChildRoute$ | async); else leftContentTemplate"
        >
          <ng-template *ngTemplateOutlet="rightContent"></ng-template>
        </ng-container>
        <ng-template #leftContentTemplate>
          <ng-template *ngTemplateOutlet="leftContent"></ng-template>
        </ng-template>
      </ng-template>

      <!-- Projected content is only rendered once. Dropping them in an ng-template allows reuse. -->
      <ng-template #rightContent
        ><ng-content select="[right]"></ng-content
      ></ng-template>
      <ng-template #leftContent
        ><ng-content select="[left]"></ng-content
      ></ng-template>
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
  > = new BehaviorSubject<boolean>(true);

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
