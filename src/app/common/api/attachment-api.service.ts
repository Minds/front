import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from './api.service';
import {
  catchError,
  concatAll,
  filter,
  map,
  mapTo,
  mergeAll,
} from 'rxjs/operators';
import {
  BehaviorSubject,
  Observable,
  of,
  OperatorFunction,
  ReplaySubject,
  throwError,
} from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import getFileType from '../../helpers/get-file-type';
import { VIDEO_PERMISSIONS_ERROR_MESSAGE } from '../services/permissions.service';
import { PermissionIntentsService } from '../services/permission-intents.service';
import { PermissionsEnum } from '../../../graphql/generated.engine';

/**
 * Upload event type
 */
export enum UploadEventType {
  Progress = 1,
  Success,
  Fail,
}

/**
 * Upload event payload
 */
export interface UploadEventPayload {
  progress?: number;
  response?: any;
  request?: { type: string };
}

/**
 * Normalized upload event
 */
export interface UploadEvent {
  type: UploadEventType;
  payload: UploadEventPayload;
}

/**
 * Angular's HTTP event to our Upload Event.
 * Disabling `includeResponse` will also disable Minds API status success check!
 */
export const httpEventToUploadEvent =
  (
    type: string,
    includeResponse: boolean = true
  ): OperatorFunction<HttpEvent<ApiResponse>, UploadEvent> =>
  (input$) =>
    input$.pipe(
      // White-list the events we need
      filter((event: HttpEvent<ApiResponse>) =>
        [
          HttpEventType.Sent,
          HttpEventType.UploadProgress,
          HttpEventType.ResponseHeader,
          includeResponse && HttpEventType.Response,
        ]
          .filter((_) => typeof _ === 'number')
          .includes(event.type)
      ),

      // Map them onto a normalized UploadEvent our app handles
      map((event: HttpEvent<ApiResponse>): UploadEvent => {
        switch (event.type) {
          case HttpEventType.Sent:
            return {
              type: UploadEventType.Progress,
              payload: { progress: 0 },
            };

          case HttpEventType.UploadProgress:
            return {
              type: UploadEventType.Progress,
              payload: { progress: event.loaded / (event.total || +Infinity) },
            };

          case HttpEventType.ResponseHeader:
            return {
              type: UploadEventType.Progress,
              payload: { progress: 1 },
            };

          case HttpEventType.Response:
            return {
              type: UploadEventType.Success,
              payload: {
                request: { type },
                response: event.body,
              },
            };
        }
      }),

      // If something happens during the upload, replace with a static HOO
      catchError((e) => {
        let errorMessage = 'E_CLIENT_ERROR';

        if (e.error && e.error.message) {
          errorMessage = e.error.message;
        } else if (e.message) {
          errorMessage = e.message;
        }

        return of({
          type: UploadEventType.Fail,
          payload: {
            request: { type },
            response: errorMessage,
          },
        });
      })
    );

/**
 * Service that handle video and image uploads as attachments
 */
@Injectable()
export class AttachmentApiService {
  public readonly videoPermissionsError$: ReplaySubject<boolean> =
    new ReplaySubject<boolean>();

  /**
   * Constructor
   * @param api
   * @param http
   */
  constructor(
    protected api: ApiService,
    protected http: HttpClient,
    private permissionIntentsService: PermissionIntentsService
  ) {}

  /**
   * Uploads a file using a "smart" strategy.
   * @param file
   * @param metadata
   */
  upload(
    file: File | null,
    metadata: { [key: string]: any }
  ): Observable<UploadEvent | null> {
    this.videoPermissionsError$.next(false);

    if (!file) {
      return of(null);
    }

    if (/image\/.+/.test(file.type)) {
      return this.uploadToApi(file, metadata);
    } else if (/video\/.+/.test(file.type)) {
      if (
        !this.permissionIntentsService.checkAndHandleAction(
          PermissionsEnum.CanUploadVideo
        )
      ) {
        this.videoPermissionsError$.next(true);
        return throwError(new Error(VIDEO_PERMISSIONS_ERROR_MESSAGE));
      }
      return this.uploadToS3(file, metadata);
    } else if (/audio\/.+/.test(file.type)) {
      return this.uploadToS3(file, metadata);
    }

    return throwError(new Error(`You cannot attach a ${file.type} file`));
  }

  /**
   * Uploads a file to S3. Used by videos.
   * @param file
   * @param metadata
   */
  protected uploadToS3(
    file: File,
    metadata: { [key: string]: any }
  ): Observable<UploadEvent> {
    // Setup initial indefinite progress
    const init: Observable<UploadEvent> = of({
      type: UploadEventType.Progress,
      payload: { progress: 100 },
    });

    // Get file type
    const fileType = getFileType(file);

    // Set pre-signed URL observable with the following operations (that depend on the response) as a map pipe
    const upload = this.api
      .put(`api/v2/media/upload/prepare/${file.type.split('/')[0]}`)
      .pipe(
        map((response: ApiResponse): Observable<UploadEvent> => {
          // Get `lease` from response
          const { lease } = response;

          // Setup upload to presigned URL (S3) observable
          const uploadToPresignedUrl: Observable<UploadEvent> = this.http
            .put(lease.presigned_url, file, {
              headers: new HttpHeaders({
                'Content-Type': file.type,
                'Ngsw-Bypass': '1',
              }),
              reportProgress: true,
              observe: 'events',
            })
            .pipe(httpEventToUploadEvent(fileType, false));

          // Setup complete observable
          const complete = this.api
            .put(
              `api/v2/media/upload/complete/${lease.media_type}/${lease.guid}`
            )
            .pipe(
              map(
                (): UploadEvent => ({
                  type: UploadEventType.Success,
                  payload: {
                    request: { type: fileType },
                    response: lease,
                  },
                })
              )
            );

          // Return an concat (one after another) observable of both follow-up operations
          return of(uploadToPresignedUrl, complete).pipe(concatAll());
        }),

        // Flatten and merge all HOO
        mergeAll()
      );

    // Return a concat of all the 3 stages
    return of(init, upload).pipe(concatAll());
  }

  /**
   * Uploads a file to Minds engine. Used by images.
   * @param file
   * @param metadata
   */
  protected uploadToApi(
    file: File,
    metadata: { [key: string]: any }
  ): Observable<UploadEvent> {
    // Uploads the file using the API service
    return this.api
      .upload(
        `api/v1/media`,
        {
          file,
          ...(metadata || {}),
        },
        { upload: true }
      )
      .pipe(httpEventToUploadEvent(getFileType(file)));
  }

  /**
   * Deletes an attachment.
   * @param guid
   */
  remove(guid: string): Observable<boolean> {
    return this.api.delete(`api/v1/media/${guid}`).pipe(mapTo(true));
  }
}
