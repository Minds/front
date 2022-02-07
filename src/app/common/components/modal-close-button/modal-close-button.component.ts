import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'm-modalCloseButton',
  templateUrl: './modal-close-button.component.html',
  styleUrls: ['./modal-close-button.component.ng.scss'],
})
export class ModalCloseButtonComponent implements OnInit {
  @Input()
  white: boolean = false;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  close() {
    this.activeModal.dismiss();
  }
}
