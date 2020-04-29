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
}

@Injectable()
export class PreviewService {
  /**
   * Builds an attachment preview resource from a file, Attachment or a null value
   * @param attachment
   */
  build(
    attachment: File | Attachment | null
  ): AttachmentPreviewResource | null {
    if (!attachment) {
      return null;
    } else if (attachment instanceof File) {
      return {
        source: 'local',
        sourceType: getFileType(attachment),
        payload: URL.createObjectURL(attachment),
      };
    } else if (typeof attachment.guid !== 'undefined') {
      return {
        source: 'guid',
        sourceType: attachment.type,
        payload: attachment.guid,
      };
    }

    throw new Error('Invalid preview resource source');
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
