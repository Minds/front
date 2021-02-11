import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormToastService } from '../../services/form-toast.service';

@Directive({ selector: '[m-attachment-paste]' })
export class AttachmentPasteDirective {
  @Output()
  filePaste: EventEmitter<File> = new EventEmitter<File>();

  /**
   * Disable via input.
   */
  @Input() disablePaste: boolean = false;

  private focused: boolean = false;

  constructor(private toast: FormToastService) {}

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
          if (this.disablePaste) {
            this.toast.warn('Sorry, you cannot add content to this post.');
            return;
          }

          this.filePaste.emit(item.getAsFile());
          break;
        }
      }
    }
  }
}
