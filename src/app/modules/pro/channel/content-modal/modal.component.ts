import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'm-pro--content-modal',
  templateUrl: 'modal.component.html'
})

export class ProContentModalComponent implements OnInit {
  entity: any;

  @Input('entity') set data(data) {
    this.entity = data;
  }

  constructor() {
  }

  ngOnInit() {
  }
}
