import { Component, Input, OnInit } from '@angular/core';

/**
 * Banner, to be used as an alternative to the giant supermind
 * button on single activity pages
 */
@Component({
  selector: 'm-supermind__banner',
  templateUrl: './supermind-banner.component.html',
  styleUrls: ['./supermind-banner.component.ng.scss'],
})
export class SupermindBannerComponent implements OnInit {
  /**
   * The entity whose owner is the subject of the banner text
   * Can be an activity or a user
   */
  @Input() entity: any;

  displayName: string;

  constructor() {}

  ngOnInit(): void {
    if (!this.entity) {
      console.error('Entity is required for m-supermind__banner');
      return;
    }

    // entity is activity
    let ownerObj = this.entity.ownerObj;

    // Entity is user
    if (this.entity.type && this.entity.type === 'user') {
      ownerObj = this.entity;
    }

    if (ownerObj && ownerObj.name) {
      this.displayName = ownerObj.name;
    }
  }
}
