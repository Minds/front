import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import { CommonModule as NgCommonModule } from '@angular/common';

/** Image orientation */
export enum ImageInputOrientationEnum {
  Square,
  Horizontal,
}

/**
 * Image input component for network admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__imageInput',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.ng.scss'],
  imports: [NgCommonModule, CommonModule],
  standalone: true,
})
export class NetworkAdminConsoleImageInputComponent {
  /** Enum for use in template */
  public readonly ImageInputOrientationEnum: typeof ImageInputOrientationEnum = ImageInputOrientationEnum;

  /** Image to display, can be URL or blob. */
  @Input() public image: string;

  /** Orientation type. */
  @Input() public type: ImageInputOrientationEnum = null;

  /** Whether to display as in progress. */
  @Input() public inProgress: boolean = false;

  /** Outputs on file change. */
  @Output('onFileChange')
  public readonly onFileChangeEmitter = new EventEmitter<File>();

  /**
   * When a request is made to upload, outputs to parent.
   * @param { File } file - The file to upload.
   * @returns { void }
   */
  public upload(file: File): void {
    this.onFileChangeEmitter.emit(file);
  }
}
