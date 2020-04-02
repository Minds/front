import { Storage } from '../../../services/storage';
import { Injectable } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';

@Injectable()
export class MessengerSounds {
  private sounds = {
    new: new Audio(),
    // + 'src/plugins/Messenger/sounds/newmsg.mp3'
    send: new Audio(),
    // + 'src/plugins/Messenger/sounds/sndmsg.mp3'
  };

  constructor(private storage: Storage, private configs: ConfigsService) {}

  play(sound: string) {
    // if (this.canPlay()) this.sounds[sound].play();
  }

  canPlay() {
    // if (this.storage.get('muted')) return false;
    return true;
  }

  mute() {
    // this.storage.set('muted', true);
  }

  unmute() {
    // his.storage.destroy('muted');
  }
}
