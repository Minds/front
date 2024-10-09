import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoModule } from '../../../../media/components/video/video.module';
import { VideoSource } from '../../../../media/components/video-player/player.service';
import { PlyrModule } from 'ngx-plyr-mg';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';

/**
 * Video shown to welcome a tenant to their network.
 */
@Component({
  selector: 'm-newTenantWelcomeVideo',
  standalone: true,
  imports: [CommonModule, VideoModule, PlyrModule],
  template: `
    <plyr
      [plyrPlaysInline]="true"
      [plyrSources]="sources"
      [plyrOptions]="options"
      tabindex="-1"
      aria-hidden="true"
    />
  `,
})
export class NewTenantWelcomeVideoComponent {
  protected readonly sources: VideoSource[];

  constructor(@Inject(STRAPI_URL) private readonly strapiUrl: string) {
    this.sources = [
      {
        id: '',
        type: '',
        size: null,
        src: `${this.strapiUrl}/uploads/new_tenant_welcome_3efce506ff.mp4`,
      },
    ];
  }

  /**
   * Options for Plyr to use
   */
  protected options: Plyr.Options = {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'captions',
      'settings',
      'airplay',
      'fullscreen',
    ],
    autoplay: true,
    muted: true, // Autoplay will not work in most browsers unless the video is muted.
    hideControls: true,
    storage: { enabled: false },
    loop: { active: true },
  };
}
