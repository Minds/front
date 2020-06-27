import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-composer__monetizeV2__custom',
  templateUrl: './custom.component.html',
})
export class ComposerMonetizeV2CustomComponent implements OnInit {
  /**
   * Signal event emitter to parent
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
