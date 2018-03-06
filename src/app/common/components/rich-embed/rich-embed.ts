import { Component, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { RichEmbedService } from '../../../services/rich-embed';
import mediaProxyUrl from '../../../helpers/media-proxy-url';

@Component({
  moduleId: module.id,
  selector: 'minds-rich-embed',
  inputs: ['_src: src', '_preview: preview', 'maxheight', 'cropImage'],
  templateUrl: 'rich-embed.html'
})
export class MindsRichEmbed {

  type: string = '';
  src: any = {};
  preview: any = {};
  maxheight: number = 320;
  inlineEmbed: any = null;
  embeddedInline: boolean = false;
  cropImage: boolean = false;
  private lastInlineEmbedParsed: string;

  constructor(private sanitizer: DomSanitizer, private service: RichEmbedService, private cd: ChangeDetectorRef) {
  }

  set _src(value: any) {
    if (!value) {
      return;
    }

    this.src = Object.assign({}, value);
    this.type = 'src';

    if (this.src.thumbnail_src) {
      this.src.thumbnail_src = mediaProxyUrl(this.src.thumbnail_src);
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
      this.preview.thumbnail = mediaProxyUrl(this.preview.thumbnail);
    }

    this.init();
  }

  init() {
    // Inline Embedding
    let inlineEmbed = this.parseInlineEmbed(this.inlineEmbed);

    if (inlineEmbed && inlineEmbed.id && this.inlineEmbed && this.inlineEmbed.id) {
      // Do not replace if ID codes are the same
      // This is needed because angular sometimes replaces the innerHTML
      // of the embedded player and restarts the videos
      if (inlineEmbed.id === this.inlineEmbed.id) {
        return;
      }
    }

    this.inlineEmbed = inlineEmbed;
  }

  action($event) {
    if (this.inlineEmbed && !this.embeddedInline) {
      $event.preventDefault();
      $event.stopPropagation();

      this.embeddedInline = true;

      if (this.inlineEmbed.htmlProvisioner) {
        this.inlineEmbed.htmlProvisioner()
          .then((html) => {
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

    // YouTube
    let youtube = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/i;

    if ((matches = youtube.exec(url)) !== null) {
      if (matches[1]) {
        return {
          id: `video-youtube-${matches[1]}`,
          className: 'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-youtube',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe
          src="https://www.youtube.com/embed/${matches[1]}?controls=2&modestbranding=1&origin=${origin}&rel=0"
          frameborder="0"
          allowfullscreen></iframe>`),
          playable: true
        };
      }
    }

    // Vimeo
    let vimeo = /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/i;

    if ((matches = vimeo.exec(url)) !== null) {
      if (matches[1]) {
        return {
          id: `video-vimeo-${matches[1]}`,
          className: 'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-vimeo',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe
          src="https://player.vimeo.com/video/${matches[1]}?autoplay=1&title=0&byline=0&portrait=0"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`),
          playable: true
        };
      }
    }

    // SoundCloud
    let soundcloud = /^(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([a-z0-9\-\/]+)/i;

    if ((matches = soundcloud.exec(url)) !== null) {
      if (matches[1]) {
        return {
          id: `audio-soundcloud-${matches[1]}`,
          className: 'm-rich-embed-audio m-rich-embed-audio-iframe m-rich-embed-audio-soundcloud',
          htmlProvisioner: () => {
            return this.service.soundcloud(url, this.maxheight)
              .then((response) => {
                return this.sanitizer.bypassSecurityTrustHtml(response.html);
              });
          },
          playable: true
        };
      }
    }

    // Spotify
    let spotify = /^(?:https?:\/\/)?open\.spotify\.com\/track\/([a-z0-9]+)/i;

    if ((matches = spotify.exec(url)) !== null) {
      if (matches[1]) {
        return {
          id: `audio-spotify-${matches[1]}`,
          className: 'm-rich-embed-audio m-rich-embed-audio-iframe m-rich-embed-audio-spotify',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe
          style="height: ${this.maxheight}px;"
          src="https://embed.spotify.com/?uri=spotify:track:${matches[1]}"
          frameborder="0" allowtransparency="true"></iframe>`),
          playable: true
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

        return {
          id: `image-giphy-${matches[1]}`,
          className: 'm-rich-embed-image m-rich-embed-image-iframe m-rich-embed-image-giphy',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe src="//giphy.com/embed/${id}"
          frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`),
          playable: true
        };
      }
    }

    // No match
    return null;
  }

  hasInlineContentLoaded() {
    return this.embeddedInline && this.inlineEmbed && this.inlineEmbed.html;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
