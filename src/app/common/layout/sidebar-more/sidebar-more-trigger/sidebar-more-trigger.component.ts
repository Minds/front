import {
  AfterViewInit,
  Component,
  HostListener,
  ViewChild,
} from '@angular/core';
import { NgxPopperjsContentComponent } from 'ngx-popperjs';

@Component({
  selector: 'm-sidebarMore__trigger',
  templateUrl: './sidebar-more-trigger.component.html',
  styleUrls: ['./sidebar-more-trigger.component.ng.scss'],
})
export class SidebarMoreTriggerComponent implements AfterViewInit {
  mobileScreenOffset: Array<number> = [-90, -250];
  mediumScreenOffset: Array<number> = [0, -50];
  largeScreenOffset: Array<number> = [0, -250];

  popperModifiers: Array<any> = [
    {
      name: 'offset',
      options: {
        offset: this.largeScreenOffset,
      },
    },
  ];

  @ViewChild('popper') popper: NgxPopperjsContentComponent;

  shown: boolean = false;

  constructor() {}

  ngAfterViewInit(): void {
    const boundaryEl = this.popper.referenceObject.parentElement.parentElement;

    this.popperModifiers.push({
      name: 'preventOverflow',
      options: {
        boundary: boundaryEl,
        altBoundary: true,
      },
    });

    this.onResize();
  }

  popperOnShown() {
    this.shown = true;
  }
  popperOnHide() {
    this.shown = false;
  }

  clickPopperContent($event) {
    // Don't hide popper if clicking 'more'/'less' footer links toggle
    if (
      $event.srcElement.classList[0] !== 'm-sidebarMoreDropdownFooter__toggle'
    ) {
      this.popper.hide();
      this.shown = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    let offset = this.largeScreenOffset;

    if (window.innerWidth < 480) {
      offset = this.mobileScreenOffset;
    } else if (window.innerWidth < 1220) {
      // 1220 is the width when the nav text is visible (vs. icons only)
      // See $layoutMax3ColWidth in common/layout/layout.scss
      offset = this.mediumScreenOffset;
    }

    this.popperModifiers.find(x => x.name === 'offset').options.offset = offset;
  }
}
