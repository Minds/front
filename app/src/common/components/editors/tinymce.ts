import { Component, EventEmitter } from '@angular/core';

declare var tinymce;

type Pattern = { regex: any, type: string, w: number, h: number, url: string, allowFullscreen: boolean };

@Component({
  selector: 'minds-tinymce',
  inputs: ['_content: content', 'reset'],
  outputs: ['update: contentChange'],
  template: `
    <textarea>{{content}}</textarea>
  `
})

export class MindsTinymce {

  editor: any;
  ready: boolean = false;
  content = '';
  update = new EventEmitter();
  timeout;

  urlPatterns: Array<Pattern> = [
    {
      regex: /youtu\.be\/([\w\-.]+)/,
      type: 'iframe', w: 560, h: 314,
      url: 'https://www.youtube.com/embed/$1',
      allowFullscreen: true
    },
    {
      regex: /youtube\.com(.+)v=([^&]+)/,
      type: 'iframe', w: 560, h: 314,
      url: 'https://www.youtube.com/embed/$2',
      allowFullscreen: true
    },
    {
      regex: /youtube.com\/embed\/([a-z0-9\-_]+(?:\?.+)?)/i,
      type: 'iframe', w: 560, h: 314,
      url: 'https://www.youtube.com/embed/$1',
      allowFullscreen: true
    },
    {
      regex: /vimeo\.com\/([0-9]+)/,
      type: 'iframe', w: 425, h: 350,
      url: 'https://player.vimeo.com/video/$1?title=0&byline=0&portrait=0&color=8dc7dc',
      allowFullscreen: true
    },
    {
      regex: /vimeo\.com\/(.*)\/([0-9]+)/,
      type: 'iframe', w: 425, h: 350,
      url: 'https://player.vimeo.com/video/$2?title=0&amp;byline=0',
      allowFullscreen: true
    },
    {
      regex: /maps\.google\.([a-z]{2,3})\/maps\/(.+)msid=(.+)/,
      type: 'iframe', w: 425, h: 350,
      url: 'https://maps.google.com/maps/ms?msid=$2&output=embed"',
      allowFullscreen: false
    },
    {
      regex: /dailymotion\.com\/video\/([^_]+)/,
      type: 'iframe', w: 480, h: 270,
      url: 'https://www.dailymotion.com/embed/video/$1',
      allowFullscreen: true
    }
  ];


  ngOnInit() {
    tinymce.init({
      selector: 'minds-tinymce > textarea',
      autoresize_max_height: '400',
      content_css: '/stylesheets/main.css',
      format: 'raw',
      menubar: false,
      toolbar: 'styleselect'
        + ' | bold italic underline textcolor'
        + ' | alignleft aligncenter alignright alignjustify'
        + ' | bullist numlist'
        + ' | link image media'
        + ' | removeformat'
        + ' | code',
      statusbar: false,
      relative_urls: false,
      remove_script_host: false,
      media_url_resolver: (data, resolve) => {
        for (let i: number = 0; i < this.urlPatterns.length; ++i) {
          const pattern: Pattern = this.urlPatterns[i];
          const match = pattern.regex.exec(data.url);
          let url;

          if (match) {
            url = pattern.url;

            for (i = 0; match[i]; i++) {
              url = url.replace('$' + i, function () {
                return match[i];
              });
            }

            data.source1 = url;
            data.type = pattern.type;
            data.allowFullscreen = pattern.allowFullscreen;
            data.width = data.width || pattern.w;
            data.height = data.height || pattern.h;
          }
        }
        let html: string = '';
        if (data.type === 'iframe') {
          html +=
            `<iframe src="${data.source1}" width="${data.width}" height="${data.height}"
            fullscreen="${data.allowFullscreen}"></iframe>`;

        }
        resolve({ 'html': html });
      },
      plugins: [
        'advlist autolink link image lists preview hr anchor pagebreak',
        'media nonbreaking code',
        'table directionality autoresize'
      ],
      setup: (ed) => {

        this.editor = ed;

        ed.on('change', (e) => {
          this.ready = true;
          this.content = ed.getContent();
          this.update.next(ed.getContent());
        });

        ed.on('keyup', (e) => {
          this.ready = true;
          this.content = ed.getContent();
          this.update.next(ed.getContent());
        });

      }
    });
  }

  ngOnDestroy() {
    this.editor.setContent('');
    if (tinymce)
      tinymce.remove('minds-tinymce > textarea');
    this.content = '';
    this.ready = false;
  }

  set _content(value: string) {
    this.content = value;
    new Promise((resolve, reject) => {
      if (this.editor)
        resolve(value);
    })
      .then((value: string) => {
        if (!this.ready && value && value !== this.editor.getContent()) {
          this.ready = true;
          this.editor.setContent(value);
        }
      });
  }

  set reset(value: boolean) {
    if (value && this.editor.getContent()) {
      this.editor.setContent(this.content);
      this.ready = false;
    }
  }

}
