import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export type Color = 'white' | 'grey' | null;

@Component({
  selector: 'm-modalCloseButton',
  templateUrl: './modal-close-button.component.html',
  styleUrls: ['./modal-close-button.component.ng.scss'],
})
export class ModalCloseButtonComponent implements OnInit {
  @Input()
  white: boolean = false;

  @Input()
  color: Color = null;

  @Input()
  autoFocus?: boolean = true;

  @Input()
  absolutePosition: boolean = true;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  close() {
    this.activeModal.dismiss();
  }
}
