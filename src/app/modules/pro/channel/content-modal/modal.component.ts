import { Component, Input, OnInit } from '@angular/core';
import { Session } from "../../../../services/session";

@Component({
  selector: 'm-pro--content-modal',
  templateUrl: 'modal.component.html'
})

export class ProContentModalComponent implements OnInit {
  minds = window.Minds;
  entity: any;
  inProgress: boolean;
  hovering: boolean;
  isFullscreen: boolean;
  title: string;

  @Input('entity') set data(data) {
    this.entity = data;
    this.title = this.entity.title || this.entity.message || `${this.entity.ownerObj.name}'s media`;
  }

  constructor(
    protected session: Session
  ) {
  }

  ngOnInit() {
  }

  toggleFullscreen() {

  }


  getOwnerIconTime() {

    const session = this.session.getLoggedInUser();

    if (session && session.guid === this.entity.ownerObj.guid) {

      return session.icontime;

    } else {

      return this.entity.ownerObj.icontime;

    }

  }
}
