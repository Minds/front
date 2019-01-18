import {
  ChangeDetectorRef,
  Component,
  HostBinding, Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { JitsiConfig, VideoChatService } from './videochat.service';

declare const JitsiMeetExternalAPI: any;

@Component({
  selector: 'm-videochat',
  templateUrl: './videochat.component.html',
})
export class VideoChatComponent implements OnInit {

  minds = window.Minds;
  isActive$;
  isFullWidth$;
  showNotice: boolean = false;

  listenerTimeout: any;
  listener = this.onReceiveMessage.bind(this);

  @Input() configs: JitsiConfig;
  @HostBinding('class.is-active') isActive = false;
  // @HostBinding('class.j-meetings-meeting--full-width') isFullWidth = false;
  @ViewChild('meet') meet;

  constructor(
    private service: VideoChatService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.isActive$ = this.service.activate$.subscribe((configs: JitsiConfig) => {
      if (configs) {
        this.configs = configs;
        this.startJitsi();
      } else {
        this.isActive = false;
      }
    });
  }

  ngOnDestroy() {
    this.service.deactivate();
    this.isActive$.unsubscribe();
  }

  startJitsi() {
    this.isActive = true;
    this.showNotice = false;
    this.cd.markForCheck();
    this.cd.detectChanges();
    const domain = 'meet.jit.si';

    this.startListener();

    const options = {
      roomName: this.configs.roomName,
      width: '100%',
      parentNode: this.meet.nativeElement,
      avatarUrl: `${this.minds.cdn_url}icon/${this.minds.user.guid}/large/${this.minds.user.icontime}`,
      interfaceConfigOverwrite: {
        // filmStripOnly: true,
        DEFAULT_REMOTE_DISPLAY_NAME: this.configs.username,
        SHOW_JITSI_WATERMARK: false,
        JITSI_WATERMARK_LINK: '',
        SHOW_WATERMARK_FOR_GUESTS: false,
        APP_NAME: 'Minds',

        TOOLBAR_BUTTONS: [

          // main toolbar
          'microphone', 'camera', 'desktop', 'fullscreen', 'fodeviceselection', 'hangup', 'tileview',
          // extended toolbar
          'settings',
          'raisehand',
          'invite',
          'livestreaming',
          'videoquality', 'filmstrip',
          'stats',
        ],
      },

    };
    const api = new JitsiMeetExternalAPI(domain, options);

    api.executeCommand('displayName', this.configs.username || 'Unknown Minds User');
    api.executeCommand('avatarUrl', `${this.minds.cdn_url}icon/${this.minds.user.guid}/large/${this.minds.user.icontime}`);

    api.on('videoConferenceLeft', () => {
      this.service.deactivate();
    });
  }

  private startListener() {
    this.listenerTimeout = setTimeout(() => {
      // if we didn't find the event we're looking for in 10 seconds, then stop listening and show error
      window.removeEventListener('message', this.listener);

      // show error
      this.showNotice = true;
    }, 10000);

    window.addEventListener('message', this.listener);
  }

  private onReceiveMessage(event) {
    if (event && event.data && event.data !== '') {
      const data = JSON.parse(event.data);
      if (typeof data === 'object' && data.method && data.method === 'video-conference-joined') {
        // remove listener and cancel timeout so the notice isn't shown
        window.removeEventListener('message', this.listener);
        clearTimeout(this.listenerTimeout);
      }
    }
  }

  end() {
    // this.service.isActive.next(false);
  }

}
