import {EventEmitter, Injectable} from '@angular/core';
import {Client} from '../../services/api/client';
import {Session} from '../../services/session';
import { BehaviorSubject, ReplaySubject, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';

export type JitsiConfig = {
  roomName: string;
  username: string;
};

@Injectable()
export class VideoChatService {

  isActive: boolean;
  activate$: EventEmitter<JitsiConfig | false> = new EventEmitter<JitsiConfig | false>();
  heartBeatSubscription;

  keepAliveInterval;

  constructor(
    private client: Client,
    private session: Session
  ) {
  }

  async activate(entity: any) {
    if (this.isActive) {
      return;
    }
    try {
      const roomName = await this.getRoomName(entity);

      this.isActive = true;

      this.activate$.emit({
        username: this.session.getLoggedInUser().username,
        roomName: roomName
      });

      if (this.heartBeatSubscription)
        this.heartBeatSubscription.unsubscribe();

      this.heartBeatSubscription = interval(10000) //10 seconds
        .pipe(startWith(0))
        .subscribe(() => this.heartBeat(entity.guid));

    } catch (e) {
      console.error('Error trying to open video chat.');
      console.error(e);
    }
  }

  deactivate() {
    this.isActive = false;
    this.activate$.emit(false);
    if (this.heartBeatSubscription)
      this.heartBeatSubscription.unsubscribe();
  }

  public async heartBeat(key: string) {
    await this.client.put(`api/v2/notifications/markers/heartbeat/${key}`);
  }

  private async getRoomName(entity: any) {
    const response: any = await this.client.get(`api/v2/video/room/${entity.guid}`);
    return response.room;
  }
}
