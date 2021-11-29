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
  largeScreenOffset: Array<number> = [0, -50];

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
    const offset =
      window.innerWidth >= 480
        ? this.largeScreenOffset
        : this.mobileScreenOffset;

    this.popperModifiers.find(x => x.name === 'offset').options.offset = offset;
  }
}
