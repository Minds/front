import { Injectable } from '@angular/core';
import {
  AttachmentApiService,
  UploadEvent,
  UploadEventType,
} from '../../../common/api/attachment-api.service';
import { of, OperatorFunction } from 'rxjs';
import { catchError, last, map, switchAll, tap } from 'rxjs/operators';
import { BoostConsolePublisherMock } from '../../boost/console/console.component.spec';
import { ConnectWalletModalService } from '../../blockchain/connect-wallet/connect-wallet-modal.service';

/**
 * Attachment types
 */
export type AttachmentType = 'image' | 'video';

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
   * RxJS operator that accepts an Upload Event and maps into a GUID or null
   * @param metadataFn
   * @param progressFn
   * @param errorFn
   */
  resolve(
    metadataFn: () => { containerGuid?: string },
    progressFn?: (inProgress: boolean, progress: number) => void,
    errorFn?: (e) => void
  ): OperatorFunction<File | Attachment | null, Attachment | null> {
    return input$ =>
      // From our input Observable:
      input$.pipe(
        // For every File | Attachment | null input:
        map(file => {
          if (!file) {
            // If falsy, map to a null value
            return of(null);
          } else if (!(file instanceof File)) {
            // If not a file (Attachment interface), return a success event
            return of({
              type: UploadEventType.Success,
              payload: {
                request: { type: file.type },
                response: { guid: file.guid },
              },
            });
          }

          const metadata = metadataFn ? metadataFn() : {};

          return this.attachmentApi
            .upload(file, { container_guid: metadata.containerGuid || null })
            .pipe(
              // On every HTTP event:
              tap(uploadEvent => {
                console.log('upload event');
                // If no progress callback, do nothing
                if (!progressFn) {
                  return;
                }

                // If no event, disable progress
                if (!uploadEvent) {
                  progressFn(false, 0);
                  return;
                }
                console.log(uploadEvent);
                // Check the type and send the progress state accordingly
                switch (uploadEvent.type) {
                  case UploadEventType.Progress:
                    progressFn(true, uploadEvent.payload.progress);
                    break;
                  // case UploadEventType.Success:
                  //   progressFn(false, 0);
                  //   break;
                  case UploadEventType.Fail:
                    throw new Error(uploadEvent.payload.response);
                  default:
                    progressFn(false, 0);
                    break;
                }
              }),

              // If something fails during upload:
              catchError(e => {
                console.log(e);
                console.log('caught err in attach serv');
                // Pass the errors through the error callback
                if (errorFn) {
                  errorFn(e);
                }

                // Replace with a complete `null` observable
                return of(null);
              }),

              // Take the last item emitted as an HOO (check below)
              last()
            );
        }),

        // Take the last emitted last() HOO from the map above. Doing this will cancel "unused" HTTP requests.
        switchAll(),

        // Map the final response to an upload event, if success emit the guid, else null
        map((uploadEvent: UploadEvent) =>
          uploadEvent
            ? {
                type: uploadEvent.payload.request.type as AttachmentType,
                guid: uploadEvent.payload.response.guid,
              }
            : null
        )
      );
  }

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
