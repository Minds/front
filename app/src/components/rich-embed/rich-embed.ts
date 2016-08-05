import { Component, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';
import { CORE_DIRECTIVES } from '@angular/common';

import { Material } from '../../directives/material';
import { MINDS_PIPES } from '../../pipes/pipes';
import { RichEmbedService } from '../../services/rich-embed';

@Component({
  selector: 'minds-rich-embed',
  inputs: [ '_src: src', '_preview: preview' ],
  templateUrl: 'src/components/rich-embed/rich-embed.html',
  directives: [ CORE_DIRECTIVES, Material ],
  pipes: [ MINDS_PIPES ]
})
export class MindsRichEmbed {
  type: string = '';
  src: any = {};
  preview: any = {};
  inlineEmbed: any = null;
  embeddedInline: boolean = false;

  constructor(private sanitizer: DomSanitizationService, private service: RichEmbedService){
  }

  set _src(value: any) {
    if (!value) {
      return;
    }

    this.src = value;
    this.type = 'src';

    this.init();
  }

  set _preview(value: any) {
    if (!value) {
      return;
    }

    this.preview = value;
    this.type = 'preview';

    this.init();
  }

  init() {
    // Inline Embedding
    let inlineEmbed = this.parseInlineEmbed(this.inlineEmbed);

    if (inlineEmbed && inlineEmbed.id && this.inlineEmbed && this.inlineEmbed.id) {
      // Do not replace if ID codes are the same
      // This is needed because angular sometimes replaces the innerHTML
      // of the embedded player and restarts the videos
      if (inlineEmbed.id == this.inlineEmbed.id) {
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
          });

        // @todo: catch any error here and forcefully window.open to destination
      }
    }
  }

  private lastInlineEmbedParsed: string;

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
          src="https://www.youtube.com/embed/${matches[1]}?autoplay=1&controls=2&modestbranding=1&origin=${origin}&rel=0"
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
            return this.service.soundcloud(url, 320)
              .then((response) => {
                return this.sanitizer.bypassSecurityTrustHtml(response.html)
              })
          },
          playable: true
        };
      }
    }

    // No match
    return null;
  }
}
