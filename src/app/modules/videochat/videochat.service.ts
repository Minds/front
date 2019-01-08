import {EventEmitter, Injectable} from '@angular/core';
import {Client} from '../../services/api/client';
import {Session} from '../../services/session';

export type JitsiConfig = {
  roomName: string;
  username: string;
};

@Injectable()
export class VideoChatService {

  isActive: boolean;
  activate$: EventEmitter<JitsiConfig | false> = new EventEmitter<JitsiConfig | false>();

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

      this.keepAliveInterval = setInterval(() => {
        this.keepAlive(roomName)
      }, 20000); // 20 seconds
    } catch (e) {
      console.error('Error trying to open video chat.');
      console.error(e);
    }
  }

  deactivate() {
    clearInterval(this.keepAliveInterval);
    this.isActive = false;
    this.activate$.emit(false);
  }

  public async keepAlive(roomName: string) {
    const response: any = await this.client.post(`api/v2/video/room/${roomName}`);
    return response.room;
  }

  private async getRoomName(entity: any) {
    const response: any = await this.client.get(`api/v2/video/room/${entity.guid}`);
    return response.room;
  }
}
