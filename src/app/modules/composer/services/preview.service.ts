import { Injectable } from '@angular/core';
import { Attachment, AttachmentType } from './attachment.service';
import getFileType from '../../../helpers/get-file-type';
import { FileUpload } from './uploader.service';

/**
 * Media resource preview
 */
export interface AttachmentPreviewResource {
  source: 'local' | 'guid';
  sourceType?: AttachmentType;
  payload?: any;
  file?: File;
  progress?: number;
}

@Injectable()
export class PreviewService {
  /**
   * Builds an attachment preview resource from a file, Attachment or a null value
   * @param attachment
   */
  build(
    attachments: FileUpload[] | Attachment[] | null
  ): AttachmentPreviewResource[] | null {
    if (!attachments) {
      return null;
    }

    const previews = [];

    for (let i in attachments) {
      const attachment = attachments[i];

      if ((<FileUpload>attachment).file !== undefined) {
        const file = (<FileUpload>attachment).file;
        previews.push({
          source: 'local',
          sourceType: getFileType(file),
          payload: URL.createObjectURL(file),
          file,
          progress: (<FileUpload>attachment).progress,
        });
      } else if (typeof attachment.guid !== 'undefined') {
        previews.push({
          source: 'guid',
          sourceType: (<Attachment>attachment).type,
          payload: attachment.guid,
        });
      }
    }

    return previews;
  }

  /**
   * Frees preview resources that are no longer used
   */
  prune(attachmentPreviewResource: AttachmentPreviewResource) {
    if (
      attachmentPreviewResource &&
      attachmentPreviewResource.source === 'local'
    ) {
      try {
        URL.revokeObjectURL(attachmentPreviewResource.payload);
      } catch (e) {
        console.warn('Composer:Preview', e);
      }
    }
  }
}
