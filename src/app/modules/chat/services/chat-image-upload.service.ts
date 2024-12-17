import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';

/**
 * Service for uploading images to the chat.
 */
@Injectable({ providedIn: 'root' })
export class ChatImageUploadService {
  constructor(private api: ApiService) {}

  /**
   * Uploads an image to the chat.
   * @param { File } file - The image file to upload.
   * @param { string } roomGuid - The GUID of the room to upload the image to.
   * @returns { Observable<HttpEvent<any>> } An observable that emits the upload event.
   */
  public upload(file: File, roomGuid: string): Observable<HttpEvent<any>> {
    return this.api.upload(
      `api/v3/chat/image/upload/${roomGuid}`,
      { file },
      {
        upload: true,
      }
    );
  }
}
