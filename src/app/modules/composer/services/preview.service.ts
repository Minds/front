import { Injectable } from '@angular/core';
import { Attachment, AttachmentType } from './attachment.service';
import getFileType from '../../../helpers/get-file-type';

/**
 * Media resource preview
 */
export interface AttachmentPreviewResource {
  source: 'local' | 'guid';
  sourceType?: AttachmentType;
  payload?: any;
  file?: File;
}

@Injectable()
export class PreviewService {
  /**
   * Builds an attachment preview resource from a file, Attachment or a null value
   * @param attachment
   */
  build(
    attachments: File[] | Attachment[] | null
  ): AttachmentPreviewResource[] | null {
    if (!attachments) {
      return null;
    }

    console.log(attachments);

    const previews = [];

    for (let i in attachments) {
      const attachment = attachments[i];

      if (attachment instanceof File) {
        previews.push({
          source: 'local',
          sourceType: getFileType(attachment),
          payload: URL.createObjectURL(attachment),
          file: attachment,
        });
      } else if (typeof attachment.guid !== 'undefined') {
        previews.push({
          source: 'guid',
          sourceType: attachment.type,
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
