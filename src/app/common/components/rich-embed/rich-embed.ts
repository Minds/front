import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { RichEmbedService } from '../../../services/rich-embed';
import { MediaProxyService } from '../../../common/services/media-proxy.service';
import { FeaturesService } from '../../../services/features.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

@Component({
  moduleId: module.id,
  selector: 'minds-rich-embed',
  inputs: ['_src: src', '_preview: preview', 'maxheight', 'cropImage'],
  templateUrl: 'rich-embed.html',
})
export class MindsRichEmbed {
  type: string = '';
  mediaSource: string = '';
  src: any = {};
  preview: any = {};
  maxheight: number = 320;
  inlineEmbed: any = null;
  @Input() embeddedInline: boolean = false;
  cropImage: boolean = false;
  modalRequestSubscribed: boolean = false;
  @Output() mediaModalRequested: EventEmitter<any> = new EventEmitter();
  private lastInlineEmbedParsed: string;

  constructor(
    private sanitizer: DomSanitizer,
    private service: RichEmbedService,
    private cd: ChangeDetectorRef,
    protected featureService: FeaturesService,
    private mediaProxy: MediaProxyService,
    private configs: ConfigsService,
    private overlayModal: OverlayModalService
  ) {}

  set _src(value: any) {
    if (!value) {
      return;
    }

    this.src = Object.assign({}, value);
    this.type = 'src';

    if (this.src.thumbnail_src) {
      this.src.thumbnail_src = this.mediaProxy.proxy(this.src.thumbnail_src);
    }

    this.init();
  }

  set _preview(value: any) {
    if (!value) {
      return;
    }

    this.preview = Object.assign({}, value);
    this.type = 'preview';

    if (this.preview.thumbnail) {
      this.preview.thumbnail = this.mediaProxy.proxy(this.preview.thumbnail);
    }

    this.init();
  }

  init() {
    // Inline Embedding
    let inlineEmbed = this.parseInlineEmbed(this.inlineEmbed);

    if (this.mediaSource === 'youtube' || this.mediaSource === 'minds') {
      this.modalRequestSubscribed =
        this.mediaModalRequested.observers.length > 0;
    }

    if (
      inlineEmbed &&
      inlineEmbed.id &&
      this.inlineEmbed &&
      this.inlineEmbed.id
    ) {
      // Do not replace if ID codes are the same
      // This is needed because angular sometimes replaces the innerHTML
      // of the embedded player and restarts the videos
      if (inlineEmbed.id === this.inlineEmbed.id) {
        return;
      }
    }

    this.inlineEmbed = inlineEmbed;

    if (
      this.overlayModal.canOpenInModal() &&
      this.modalRequestSubscribed &&
      this.mediaSource === 'youtube'
    ) {
      if (this.inlineEmbed && this.inlineEmbed.htmlProvisioner) {
        this.inlineEmbed.htmlProvisioner().then(html => {
          this.inlineEmbed.html = html;
          this.detectChanges();
        });

        // @todo: catch any error here and forcefully window.open to destination
      }
    }
  }

  action($event) {
    if (
      this.modalRequestSubscribed &&
      (this.mediaSource === 'youtube' || this.mediaSource === 'minds') &&
      this.overlayModal.canOpenInModal()
    ) {
      $event.preventDefault();
      $event.stopPropagation();
      this.mediaModalRequested.emit();
      return;
    }

    if (this.inlineEmbed && !this.embeddedInline) {
      $event.preventDefault();
      $event.stopPropagation();

      this.embeddedInline = true;

      if (this.inlineEmbed.htmlProvisioner) {
        this.inlineEmbed.htmlProvisioner().then(html => {
          this.inlineEmbed.html = html;
          this.detectChanges();
        });

        // @todo: catch any error here and forcefully window.open to destination
      }
    }
  }

  parseInlineEmbed(current?: any) {
    if (!this.src || !this.src.perma_url) {
      return null;
    }

    let url = this.src.perma_url,
      origin = window.location.host,
      matches;

    if (url === this.lastInlineEmbedParsed) {
      return current;
    }

    this.lastInlineEmbedParsed = url;

    // Minds blog
    const siteUrl = this.configs.get('site_url');
    if (url.indexOf(siteUrl) === 0) this.mediaSource = 'minds';

    // YouTube
    let youtube = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/i;

    if ((matches = youtube.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'youtube';
        return {
          id: `video-youtube-${matches[1]}`,
          className:
            'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-youtube',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe
          src="https://www.youtube.com/embed/${matches[1]}?controls=1&modestbranding=1&origin=${origin}&rel=0"
          frameborder="0"
          allowfullscreen></iframe>`),
          playable: true,
        };
      }
    }

    // Vimeo
    let vimeo = /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/i;

    if ((matches = vimeo.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'vimeo';
        return {
          id: `video-vimeo-${matches[1]}`,
          className:
            'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-vimeo',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe
          src="https://player.vimeo.com/video/${matches[1]}?title=0&byline=0&portrait=0"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`),
          playable: true,
        };
      }
    }

    // SoundCloud
    let soundcloud = /^(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([a-z0-9\-\/]+)/i;

    if ((matches = soundcloud.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'soundcloud';
        return {
          id: `audio-soundcloud-${matches[1]}`,
          className:
            'm-rich-embed-audio m-rich-embed-audio-iframe m-rich-embed-audio-soundcloud',
          htmlProvisioner: () => {
            return this.service
              .soundcloud(url, this.maxheight)
              .then(response => {
                if (!response.id) {
                  return 'Error on soundcloud embed';
                }
                return this.sanitizer.bypassSecurityTrustHtml(`<iframe
                width="100%" height="400" scrolling="no" frameborder="no"
                src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F${response.id}&show_artwork=true&auto_play=true&show_comments=true">
                </iframe>`);
              });
          },
          playable: true,
        };
      }
    }

    // Spotify
    let spotify = /^(?:https?:\/\/)?open\.spotify\.com\/track\/([a-z0-9]+)/i;

    if ((matches = spotify.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'spotify';
        return {
          id: `audio-spotify-${matches[1]}`,
          className:
            'm-rich-embed-audio m-rich-embed-audio-iframe m-rich-embed-audio-spotify',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe
          style="height: ${this.maxheight}px;"
          src="https://embed.spotify.com/?uri=spotify:track:${matches[1]}"
          frameborder="0" allowtransparency="true"></iframe>`),
          playable: true,
        };
      }
    }

    // Giphy
    let giphy = /^(?:https?:\/\/)?(?:www\.)?giphy\.com\/gifs\/([a-z0-9\-]+)/i;

    if ((matches = giphy.exec(url)) !== null) {
      if (matches[1]) {
        let idTokens: string[] = matches[1].split('-'),
          id: string = idTokens.pop();

        if (!id) {
          return null;
        }
        this.mediaSource = 'giphy';
        return {
          id: `image-giphy-${matches[1]}`,
          className:
            'm-rich-embed-image m-rich-embed-image-iframe m-rich-embed-image-giphy',
          html: this.sanitizer
            .bypassSecurityTrustHtml(`<iframe src="//giphy.com/embed/${id}"
          frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`),
          playable: true,
        };
      }
    }

    // No match
    return null;
  }

  hasInlineContentLoaded() {
    return (
      this.embeddedInline &&
      this.inlineEmbed &&
      this.inlineEmbed.html &&
      (!this.modalRequestSubscribed || !this.overlayModal.canOpenInModal())
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
