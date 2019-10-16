import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import dialogPolyfill from 'dialog-polyfill';

@Component({
  selector: 'minds-dialog',
  templateUrl: 'dialog.component.html',
})
export class MindsDialog {
  @Input() id: string;
  @Input() title = 'Minds Dialog';
  @Input() message = 'Confirm to continue';
  @Input() confirmButtonText = 'Confirm';
  @Input() cancelButtonText = 'Cancel';
  @Input() showDialog = false;

  @Output() confirmed: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('dialog', { static: true }) dialogElement: ElementRef;
  private nativeDialogElement: any;

  ngOnInit() {
    dialogPolyfill.registerDialog(this.dialogElement.nativeElement);
    this.nativeDialogElement = this.dialogElement.nativeElement;
  }

  ngOnChanges() {
    if (this.showDialog) {
      this.nativeDialogElement.showModal();
    }
  }

  close() {
    this.showDialog = false;
    this.nativeDialogElement.close();
  }

  confirmClick() {
    this.close();
    this.confirmed.emit(true);
  }

  cancelClick() {
    this.close();
    this.confirmed.emit(false);
  }
}
