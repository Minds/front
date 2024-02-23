import {
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';

/**
 * Drag and drop directive. Uses host listeners to listen for drag and drop events
 * prevent default behaviour and respond my emitting the dropped file through the
 * onFileDropped emitter.
 *
 * Usage example, on a container div:
 * m-dragAndDrop (onFileDropped)="onAttachmentPaste($event)"

 * Based on Mariem Chaabeni's code at:
 * https://medium.com/@mariemchabeni/angular-7-drag-and-drop-simple-file-uploadin-in-less-than-5-minutes-d57eb010c0dc
 */
@Directive({
  selector: '[m-dragAndDrop]',
})
export class DragAndDropDirective {
  /**
   * Emits the dropped file.
   */
  @Output() onFileDropped = new EventEmitter<any>();

  /**
   * Disable drag and drop via input.
   */
  @Input() disabled: boolean = false;

  /**
   * Dynamically set opacity
   */
  @HostBinding('style.opacity') protected opacity = '1';

  /**
   * Dragover event HostListener, sets opacity lower.
   */
  @HostListener('dragover', ['$event']) onDragOver(event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disabled) {
      this.opacity = '0.8';
    }
  }

  /**
   * Drag leave event HostListener, sets opacity higher.
   */
  @HostListener('dragleave', ['$event']) public onDragLeave(event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disabled) {
      this.opacity = '1';
    }
  }

  /**
   * Drop event HostListener, sets opacity back to one and emits the file.
   * If multiple files are selected the first will be emitted.
   */
  @HostListener('drop', ['$event']) public ondrop(event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disabled) {
      this.opacity = '1';
      let files = event.dataTransfer.files;
      if (files.length > 0) {
        this.onFileDropped.emit(files[0]);
      }
    }
  }
}
