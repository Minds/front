import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Storage } from '../../../../services/storage';

/**
 * Adds a dot to the upper right corner of the discovery sidebar nav icon
 * The dot disappears when the nav item is clicked
 * Click timestamp is stored in local storage
 *
 * Experimentally, show the dot by default and then
 * again every 24 hours after it was clicked
 */
@Component({
  selector: 'm-sidebarNavigation__newContentDot',
  templateUrl: './new-content-dot.component.html',
  styleUrls: ['./new-content-dot.component.ng.scss'],
})
export class SidebarNavigationNewContentDotComponent implements OnInit {
  constructor(
    private storage: Storage,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  showDot: boolean = false;
  storageKey: string = 'discovery_sidenav_clicked_ts';

  @Input() set discoveryLinkClicked(value: boolean) {
    if (value) {
      const now = Date.now();

      // Store the ts when the discovery link was clicked
      this.storage.set(this.storageKey, now);

      // Hide the dot after a short delay
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => (this.showDot = false), 250);
      }
    }
  }

  /**
   * Determine whether to show the dot
   */
  ngOnInit(): void {
    // Show if no previous discovery click is stored
    if (!this.storage.get(this.storageKey)) {
      this.showDot = true;
      return;
    }

    // If previous discovery click IS stored, only
    // show again if enough time has passed
    const previousClickTs = Number(this.storage.get(this.storageKey));
    const msBeforeWeShowDotAgain = 86400 * 1000; // 24 hours

    if (Date.now() - previousClickTs >= msBeforeWeShowDotAgain) {
      this.showDot = true;
    }
  }
}
