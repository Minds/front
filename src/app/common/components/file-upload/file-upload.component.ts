import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { UniqueId } from '../../../helpers/unique-id.helper';

/**
 * Event signature.
 */
export type FileUploadSelectEvent = File | File[] | null;

/**
 * Wrapper class type. Same signature as NgClass.
 */
export type WrapperClass =
  | string
  | string[]
  | Set<string>
  | {
      [key: string]: any;
    };

/**
 * Generic stylable file-upload component
 */
@Component({
  selector: 'm-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'file-upload.component.html',
})
export class FileUploadComponent {
  /**
   * Wrapper class.
   */
  @Input() wrapperClass: WrapperClass = [];

  /**
   * Is the field disabled?
   */
  @Input() disabled: boolean = false;

  /**
   * Which files should we accept? Same <input accept> format.
   */
  @Input() accept: string = '*.*';

  /**
   * Can the user select multiple files?
   */
  @Input() multiple: boolean = false;

  /**
   * OnSelect event
   */
  @Output('onSelect') onSelectEmitter: EventEmitter<FileUploadSelectEvent> =
    new EventEmitter<FileUploadSelectEvent>();

  /**
   * Wrapper <form> DOM element. Used for a reliable reset().
   */
  @ViewChild('fileForm', { static: true })
  fileForm: ElementRef<HTMLFormElement>;

  /**
   * <input type=file> DOM element. Used in spec tests.
   */
  @ViewChild('file', { static: true }) file: ElementRef<HTMLInputElement>;

  /**
   * ID for labels.
   */
  id: string = UniqueId.generate('m-file-upload');

  /**
   * Triggers the output when the user selects a file
   * @param file
   */
  onSelect(file: HTMLInputElement): void {
    if (!file || !file.files) {
      this.onSelectEmitter.emit(this.multiple ? [] : null);
      return;
    }

    if (this.multiple) {
      this.onSelectEmitter.emit(Array.from(file.files));
    } else {
      this.onSelectEmitter.emit(file.files[0] || null);
    }
  }

  /**
   * Resets the file field. Called externally when an attachment is deleted.
   */
  reset() {
    if (this.fileForm.nativeElement) {
      this.fileForm.nativeElement.reset();
    }
  }
}
