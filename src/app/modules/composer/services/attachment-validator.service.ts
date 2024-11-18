import { Injectable } from '@angular/core';
import { Attachment } from './attachment.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';

// default max duration
const DEFAULT_MAX_LENGTH = 1260;

// default max duration for Minds+ and Minds Pro users.
const DEFAULT_MAX_LENGTH_PLUS = 5700;

// default max file size for all users (BYTES)
const DEFAULT_MAX_FILE_SIZE = 4294967296;

// failure codes.
export type AttachmentValidationFailureCode =
  | 'Video:MaxLengthExceeded'
  | 'Video:MaxSizeExceeded';

// payload returned.
export type AttachmentValidationPayload = {
  isValid: boolean;
  codes?: [AttachmentValidationFailureCode] | any[];
  message?: string;
  maxFileSize?: number;
  maxLength?: number;
  maxLengthPlus?: number;
} | null;

/**
 * Validates a given attachment's filesize and duration.
 */
@Injectable({ providedIn: 'root' })
export class AttachmentValidatorService {
  // max length / duration for non Minds+ / Pro.
  private readonly maxLength;

  // max length / duration for Minds+ / Pro.
  private readonly maxLengthPlus;

  // max file size for all users in bytes.
  private readonly maxFileSize;

  constructor(
    private session: Session,
    config: ConfigsService
  ) {
    this.maxLength = config.get('max_video_length') ?? DEFAULT_MAX_LENGTH;
    this.maxLengthPlus =
      config.get('max_video_length_plus') ?? DEFAULT_MAX_LENGTH_PLUS;
    this.maxFileSize =
      config.get('max_video_file_size') ?? DEFAULT_MAX_FILE_SIZE;
  }

  /**
   * Loads a video into an unplaced html video element.
   * @param { File | Attachment } - file or attachment to load.
   * @returns { Promise<GlobalEventHandlers> } - resolves on video load or error.
   */
  private loadVideo(file: File | Attachment): Promise<GlobalEventHandlers> {
    return new Promise((resolve, reject) => {
      try {
        if (file.type === 'video/x-ms-wmv') {
          throw new Error('Filetype cannot be loaded as a video element');
        }

        let video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
          resolve(this);
        };

        video.onerror = function () {
          reject('An unknown error has occurred');
        };

        video.src = window.URL.createObjectURL(file as Blob);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Validate a given file or attachment.
   * @param { File | Attachment } file - file to validate.
   * @returns { Promise<AttachmentValidationPayload> } - payload.
   */
  public async validate(
    file: File | Attachment
  ): Promise<AttachmentValidationPayload> {
    if (!file || !file.type) {
      return;
    }
    if (/image\/.+/.test(file.type)) {
      return { isValid: true };
    } else if (/video\/.+/.test(file.type)) {
      let payload = {
        isValid: true,
        codes: [],
        maxLength: this.maxLength,
        maxLengthPlus: this.maxLengthPlus,
        maxFileSize: this.maxFileSize,
      };

      if (!this.isValidSize(file)) {
        payload.isValid = false;
        payload.codes.push('Video:MaxSizeExceeded');
      }

      let video = null;
      try {
        video = await this.loadVideo(file);
      } catch (e) {
        // if we cannot load it - return valid.
        return payload;
      }

      if (!this.isValidLength(video)) {
        payload.isValid = false;
        payload.codes.push('Video:MaxLengthExceeded');
      }

      return payload;
    } else {
      return { isValid: true };
    }
  }

  /**
   * Check whether length is valid.
   * @param video - video to check length of.
   * @returns { boolean } - true if video is of a valid length.
   */
  private isValidLength(video: unknown): boolean {
    let maxLength = this.maxLength;

    if (this.session.getLoggedInUser().plus) {
      maxLength = this.maxLengthPlus;
    }

    return (video as any).duration <= maxLength ?? false;
  }

  /**
   * Check whether file is a valid filesize.
   * @param file - file to check the size of.
   * @returns { boolean } - true if file is within valid bounds.
   */
  private isValidSize(file: any): boolean {
    return file.size && file.size <= this.maxFileSize;
  }
}
