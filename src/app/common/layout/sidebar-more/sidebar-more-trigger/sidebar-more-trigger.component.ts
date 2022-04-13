import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';
import { NgxPopperjsContentComponent } from 'ngx-popperjs';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-sidebarMore__trigger',
  templateUrl: './sidebar-more-trigger.component.html',
  styleUrls: ['./sidebar-more-trigger.component.ng.scss'],
})
export class SidebarMoreTriggerComponent implements AfterViewInit {
  @Output('toggle') onToggle: EventEmitter<Boolean> = new EventEmitter<
    Boolean
  >();

  popperPlacement: string = 'right';

  popperModifiers: Array<any> = [
    // Optimizes performance by disabling listeners
    // when the popper isn't visible
    {
      name: 'eventListeners',
      enabled: false,
    },
    {
      name: 'offset',
      options: {
        offset: [180, -70],
      },
    },
    {
      name: 'preventOverflow',
      options: {
        padding: { top: 10, bottom: 65 },
      },
    },
  ];

  @ViewChild('popper') popper: NgxPopperjsContentComponent;

  shown: boolean = false;

  constructor(public session: Session) {}

  ngAfterViewInit(): void {
    this.onResize();
  }

  popperOnShown($event): void {
    this.calculateOffset();
    this.popperModifiers.find(x => x.name === 'eventListeners').enabled = true;
    this.show(true);
  }
  popperOnHide($event): void {
    this.popperModifiers.find(x => x.name === 'eventListeners').enabled = false;
    this.show(false);
  }

  clickPopperContent($event) {
    // Don't hide popper if clicking 'more'/'less' footer links toggle
    if (
      $event.srcElement.classList[0] !== 'm-sidebarMoreDropdownFooter__toggle'
    ) {
      this.popper.hide();
      this.shown = false;
    } else {
      this.calculateOffset();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateOffset();
  }

  show(isShown: boolean): void {
    this.shown = isShown;
    this.onToggle.emit(this.shown);
  }

  /**
   * Moves the popper in relation to its default position
   * (which is middle-right side of trigger)
   */
  calculateOffset(): void {
    /************************************************
     * HORIZONTAL AXIS
     * Moves popperEl from trigger's right side to left side
     *
     */
    // Medium screens
    let y = -70;
    if (window.innerWidth < 480) {
      // Mobile screens
      y = -275;
    } else if (window.innerWidth >= 1220) {
      // Large screens
      // 1220 is the width when the nav text is visible
      // (vs. icons only)
      // See $layoutMax3ColWidth in common/layout/layout.scss
      y = -250;
    }
    /************************************************
     * VERTICAL AXIS
     * Align popperEl top with triggerEl top to start
     */
    const triggerHeight = 35;
    const popperHeight = this.session.isLoggedIn() ? 396 : 133;

    let x = popperHeight / 2 - triggerHeight / 2;
    // ************************************
    this.popperModifiers.find(x => x.name === 'offset').options.offset = [x, y];
  }
}
