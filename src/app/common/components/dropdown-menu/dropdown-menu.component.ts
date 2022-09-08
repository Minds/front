import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AnalyticsService } from './../../../services/analytics';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface AnchorPosition {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

/**
 * Reusable dropdown menu component
 *
 * Uses <ng-content> to make a component of choice into the trigger that opens the menu
 */
@Component({
  selector: 'm-dropdownMenu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['dropdown-menu.component.ng.scss'],
  templateUrl: 'dropdown-menu.component.html',
})
export class DropdownMenuComponent implements OnInit, OnDestroy {
  @Input() menu: TemplateRef<any>;

  @Input() triggerClass: string = '';

  @Input() menuClass: string = '';

  @Input() anchorPosition: AnchorPosition = {
    top: '100%',
    left: '0',
  };

  // True if any menu option opens up a nested submenu
  // (e.g.composer meatball)
  // We disable the dropDown animation in this case because the
  // animation requires `overflow:hidden`, which would
  // hide the submenus
  @Input() hasSubmenu = false;

  @ViewChild('triggerElement') triggerElement: ElementRef<HTMLSpanElement>;

  @ViewChild('menuWrapperElement')
  menuWrapperElement: ElementRef<HTMLDivElement>;

  @Input('data-ref') dataRef: string;

  isOpen: boolean = false;

  protected windowSize$: Subject<{
    width: number;
    height: number;
  }> = new Subject<{ width: number; height: number }>();

  protected windowSizeSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    protected analytics: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.windowSizeSubscription = this.windowSize$
      .pipe(debounceTime(250))
      .subscribe(() => this.calculatePosition());
  }

  ngOnDestroy(): void {
    this.isOpen = false;
    this.windowSizeSubscription.unsubscribe();
  }

  open($event: MouseEvent) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    // track the click event manually because stopPropagation will
    // prevent the document click event from firing
    if (this.dataRef) {
      this.analytics.trackClick(this.dataRef);
    }

    this.isOpen = true;
    this.detectChanges();

    this.calculatePosition();
  }

  close($event?: MouseEvent) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    this.isOpen = false;
  }

  get triggerCssClasses() {
    const classList = [
      'm-dropdownMenu__trigger',
      'm-dropdownMenuTrigger--clickable',
      'm-activity__redirect--stopClick', // don't redirect to single post page when clicked from within an activity
    ];

    if (this.triggerClass) {
      classList.push(
        ...this.triggerClass
          .split(' ')
          .map(className => className.trim())
          .filter(Boolean)
      );
    }

    return classList;
  }

  get menuCssClasses() {
    const classList = ['m-dropdownMenu__menu'];

    if (this.menuClass) {
      classList.push(
        ...this.menuClass
          .split(' ')
          .map(className => className.trim())
          .filter(Boolean)
      );
    }

    return classList;
  }

  @HostListener('window:resize') onWindowResize() {
    this.calculatePosition();
  }

  calculatePosition() {
    // TODO: To be done later (smart anchoring on screen)
    //
    // Only is open, there's a menu wrapper and platform is browser (because of `window`)
    // if (!this.isOpen || !this.menuWrapperElement.nativeElement || !isPlatformBrowser(this.platformId)) {
    //   return;
    // }
    //
    // const win = {
    //   w: window.innerWidth,
    //   h: window.innerHeight,
    // };
    //
    // console.log(this.menuWrapperElement.nativeElement);
    // console.log(JSON.parse(JSON.stringify(this.menuWrapperElement.nativeElement.getBoundingClientRect())));
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
