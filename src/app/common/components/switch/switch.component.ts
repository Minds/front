import { Component, EventEmitter, Input, Output } from "@angular/core";

let _uniqueId = 1000;

@Component({
  selector: 'm-switch',
  templateUrl: 'switch.component.html'
})
export class SwitchComponent {
  switchId: string;

  @Input() mModel: any;
  @Input() labelClass: string | string[] | Set<string> | { [key: string]: any; } = '';

  @Output() mModelChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<Event> = new EventEmitter<Event>();

  constructor() {
    _uniqueId++;
    this.switchId = `m-switch_${_uniqueId}`;
  }

  emitMModelChange($event) {
    this.mModelChange.emit($event);
  }

  emitChange($event) {
    this.change.emit($event);
  }
}
