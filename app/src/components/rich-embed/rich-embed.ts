import { Component, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { Material } from '../../directives/material';
import { MINDS_PIPES } from '../../pipes/pipes';

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

    let inlineEmbed = this.parseInlineEmbed();

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
    }
  }

  parseInlineEmbed() {
    if (!this.src || !this.src.perma_url) {
      return null;
    }

    let url = this.src.perma_url,
      origin = window.location.host,
      matches;

    // YouTube
    let youtube = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/i;

    if ((matches = youtube.exec(url)) !== null) {
      if (matches[1]) {
        return {
          id: `video-youtube-${matches[1]}`,
          className: 'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-youtube',
          html: `<iframe
          src="https://www.youtube.com/embed/${matches[1]}?autoplay=1&controls=2&modestbranding=1&origin=${origin}&rel=0"
          frameborder="0"
          allowfullscreen></iframe>`,
          playable: true
        };
      }
    }

    // YouTube
    let vimeo = /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/i;

    if ((matches = vimeo.exec(url)) !== null) {
      if (matches[1]) {
        return {
          id: `video-vimeo-${matches[1]}`,
          className: 'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-vimeo',
          html: `<iframe
          src="https://player.vimeo.com/video/${matches[1]}?autoplay=1&title=0&byline=0&portrait=0"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`,
          playable: true
        };
      }
    }

    // No match
    return null;
  }
}
