import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  first,
  last,
  map,
  mergeAll,
  mergeMap,
  scan,
  share,
  startWith,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  AttachmentApiService,
  UploadEventType,
} from '../../../common/api/attachment-api.service';
import { AttachmentType } from './attachment.service';

export interface FileUpload {
  file: File;
  progress: number;
  error: boolean;
  toRemove: boolean;
  guid?: string;
}

@Injectable({ providedIn: 'root' })
export class UploaderService implements OnDestroy {
  /**
   * Emit to here to upload a new file
   */
  public file$$: Subject<File> = new Subject();

  /**
   * Emit to here to retry a failed upload
   */
  protected retryFile$$: Subject<File> = new Subject();

  /**
   * Emit to here to remove a File from the upload
   */
  public stopFile$$: Subject<File> = new Subject();

  /**
   * Will retry a failed file
   */
  fileStartOrRetry$: Observable<File> = this.file$$.pipe(
    mergeMap(file =>
      this.retryFile$$.pipe(
        filter(retryFile => retryFile === file),
        startWith(file)
      )
    ),
    share()
  );

  /**
   * Queues a file to be uploaded
   */
  addFileToQueueAfterStartOrRetry$: Observable<
    FileUpload
  > = this.fileStartOrRetry$.pipe(
    map(file => ({
      file,
      progress: 0,
      error: false,
      toRemove: false,
    }))
  );

  /**
   * Queues uploads to be delted
   */
  markFileToBeRemovedAfterStop$: Observable<FileUpload> = this.stopFile$$.pipe(
    map(file => ({
      file,
      progress: 0,
      error: false,
      toRemove: true,
    }))
  );

  /**
   * Performs the actual upload and records progress
   */
  updateFileProgress$: Observable<FileUpload> = this.fileStartOrRetry$.pipe(
    map(file =>
      this.attachmentApi.upload(file, {}).pipe(
        filter(uploadEvent => {
          return (
            uploadEvent.type === UploadEventType.Progress ||
            uploadEvent.type === UploadEventType.Success
          );
        }),
        map(uploadEvent => {
          return {
            type: uploadEvent.payload?.request?.type as AttachmentType,
            guid: uploadEvent.payload?.response?.guid,
            progress: uploadEvent.payload.progress,
          };
        }),
        takeUntil(
          this.stopFile$$.pipe(filter(stopFile => stopFile.name === file.name))
        ),
        catchError(() => of({ error: true })),
        scan(
          (
            acc,
            curr:
              | { type: AttachmentType; guid: string; progress: number }
              | { error: true }
          ) => ({
            ...acc,
            ...curr,
          }),
          {
            file,
            guid: null,
            type: null,
            progress: 0,
            error: false,
            toRemove: false,
          }
        )
      )
    ),
    mergeAll(3) // max 3 uploads at a time
  );

  /**
   * Subscribe here to track all upload current state
   */
  files$: Observable<FileUpload[]> = merge(
    this.addFileToQueueAfterStartOrRetry$,
    this.updateFileProgress$,
    this.markFileToBeRemovedAfterStop$
  ).pipe(
    scan<FileUpload, { [key: string]: FileUpload }>((acc, curr) => {
      if (curr.toRemove) {
        const copy = { ...acc };
        delete copy[curr.file?.name];
        return copy;
      }

      return {
        ...acc,
        [curr.file?.name]: curr,
      };
    }, {}),
    map(fileUploads => Object.values(fileUploads)),
    share()
  );

  /**
   * The count of active uploads
   */
  filesCount$: Observable<number> = this.files$.pipe(
    startWith([]), // So we have an initial value of 0
    map(fileUploads => fileUploads?.length || 0)
  );

  /**
   * Confirms all the uploads have returned guids from the server
   */
  isUploadingFinished$: Observable<boolean> = this.files$.pipe(
    startWith([]),
    map(fileUploads => {
      const guids = fileUploads.map(fileUpload => fileUpload.guid);
      return guids.length === guids.filter(guid => !!guid).length; // If we have 'undefined' guids, we're not done yet
    })
  );

  /**
   * Struggle to get the observables to resolve, so we keep a reference of the values below
   * used mainly for reset loop
   */
  fileUploadRefSubscription: Subscription;
  fileUploadRefs: FileUpload[] = [];

  constructor(protected attachmentApi: AttachmentApiService) {
    this.fileUploadRefSubscription = this.files$.subscribe(fileUploads => {
      this.fileUploadRefs.push(...fileUploads);
    });
  }

  ngOnDestroy() {
    this.fileUploadRefSubscription?.unsubscribe();
  }

  /**
   * Will attempt to reset the state of this service
   */
  async reset() {
    for (let i in this.fileUploadRefs) {
      const file = this.fileUploadRefs[i].file;
      this.stopFile$$.next(file);
    }
  }
}
