import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[m-attachment-paste]' })
export class AttachmentPasteDirective {
  @Output()
  filePaste: EventEmitter<File> = new EventEmitter<File>();

  private focused: boolean = false;

  @HostListener('focus') onFocus() {
    this.focused = true;
  }

  @HostListener('focusout') onFocusOut() {
    this.focused = false;
  }

  @HostListener('window:paste', ['$event']) onPaste(event: ClipboardEvent) {
    if (this.focused) {
      for (const index in event.clipboardData.items) {
        const item: DataTransferItem = event.clipboardData.items[index];

        if (item.kind === 'file') {
          this.filePaste.emit(item.getAsFile());
          break;
        }
      }
    }
  }
}
