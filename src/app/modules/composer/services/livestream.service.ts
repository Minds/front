import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import {
  PermissionsService,
  VIDEO_PERMISSIONS_ERROR_MESSAGE,
} from '../../../common/services/permissions.service';
@Injectable({ providedIn: 'root' })
export class LivestreamService {
  private apiUrl = 'https://livepeer.studio/api/stream';
  private stream: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private session: Session,
    private mindsConfigService: ConfigsService,
    private permissions: PermissionsService
  ) {}

  async createLiveStream(): Promise<any> {
    if (!this.permissions.canUploadVideo()) {
      console.error(VIDEO_PERMISSIONS_ERROR_MESSAGE);
      return;
    }
    const timestamp = new Date().getTime();
    const streamData = {
      name: `web_${timestamp}_${this.session.getLoggedInUser().guid}`,
      record: true,
    };

    const headers = this.createHeaders();

    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl, streamData, { headers })
      );
      this.setStream(response);
      return response;
    } catch (error) {
      console.error('Error creating live stream:', error);
      throw error;
    }
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.mindsConfigService.get<string>(
        'livepeer_api_key'
      )}`,
    });
  }

  setStream(stream: any): void {
    this.stream.next(stream);
  }

  getCreatedStream(): Observable<any> {
    return this.stream.asObservable();
  }

  async getStream(id: string): Promise<any> {
    const headers = this.createHeaders();
    const link = `${this.apiUrl}/${id}`;

    try {
      const response = await this.http
        .get<any>(link, { headers })
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error getting live stream:', error);
      throw error;
    }
  }

  async toggleRecordLivestream(id: string, record: boolean): Promise<any> {
    const streamData = {
      record,
    };

    const headers = this.createHeaders();
    const link = `${this.apiUrl}/${id}`;

    try {
      const response = await this.http
        .patch<any>(link, streamData, { headers })
        .toPromise();
      console.log(`Recording ${record ? 'strated' : 'stoped'}`);
      return response;
    } catch (error) {
      console.error('Error recording live stream:', error);
      throw error;
    }
  }

  async getStreamFromPlayback(playbackId: string): Promise<any> {
    const headers = this.createHeaders();
    const link = `${this.apiUrl}?playbackId=${playbackId}`;

    try {
      const response = await this.http
        .get<any>(link, { headers })
        .toPromise();
      return response[0].id;
    } catch (error) {
      console.error('Error recording live stream:', error);
      throw error;
    }
  }

  async getRecording(streamId: string): Promise<any> {
    const headers = this.createHeaders();
    const link = `https://livepeer.studio/api/asset/${streamId}`;

    try {
      const response = await this.http
        .get<any>(link, { headers })
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error getting recording:', error);
      throw error;
    }
  }
}
