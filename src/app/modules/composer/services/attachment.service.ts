import { Injectable } from '@angular/core';
import { AttachmentApiService } from '../../../common/api/attachment-api.service';

/**
 * Attachment types
 */
export type AttachmentType = 'image' | 'video' | 'audio';

/**
 * Attachments
 */
export interface Attachment {
  type: AttachmentType;
  guid: string;
}

@Injectable()
export class AttachmentService {
  /**
   * Constructor
   * @param attachmentApi
   */
  constructor(protected attachmentApi: AttachmentApiService) {}

  /**
   * Removes an an attachment
   * @param guid
   */
  prune(guid: string): Promise<boolean> {
    if (!guid) {
      return Promise.resolve(true);
    }

    return this.attachmentApi.remove(guid).toPromise();
  }
}
