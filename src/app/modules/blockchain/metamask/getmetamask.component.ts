import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'm-get-metamask',
  templateUrl: 'getmetamask.component.html',
})
export class GetMetamaskComponent {
  public static ACTION_CREATE = 'create';
  public static ACTION_UNLOCK = 'unlock';
  public static ACTION_CANCEL = 'cancel';

  @Output() actioned: EventEmitter<String> = new EventEmitter();

  minds: Minds = window.Minds;

  create() {
    this.actioned.emit(GetMetamaskComponent.ACTION_CREATE);
  }

  unlock() {
    this.actioned.emit(GetMetamaskComponent.ACTION_UNLOCK);
  }

  cancel() {
    this.actioned.emit(GetMetamaskComponent.ACTION_CANCEL);
  }
}
