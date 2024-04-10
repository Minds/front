import Editor = MediumEditor.MediumEditor;
import { ToasterService } from '../../../services/toaster.service';

type Options = { buttonText: string };

export class EmbedVideo {
  button: HTMLButtonElement;
  options: any;
  base: Editor;
  window;
  document;
  private _serializePreImages: Function;
  $place;
  $element;
  private updated: boolean = false;
  private readonly urlRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

  constructor(
    options: Options,
    protected toasterService: ToasterService
  ) {
    this.options = { ...options };
    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action';
    this.button.innerHTML = options.buttonText || '</>';
    this.button.onclick = this.handleClick.bind(this);
  }

  public init() {
    this.$element = document.querySelector('.medium-editor-element');

    this.base.subscribe('editableInput', () => {
      if (this.updated) {
        return;
      }
      this.updated = true;
      const $embeds = this.$element.querySelectorAll('.medium-insert-embeds');

      for (let i: number = 0; i < $embeds.length; ++i) {
        const item = $embeds[i];

        item.setAttribute('contenteditable', false);
        if (!item.querySelector('.medium-insert-embeds-overlay')) {
          const div = document.createElement('div');
          div.classList.add('medium-insert-embeds-overlay');
          item.appendChild(div);
        }
      }
    });

    this.events();
  }

  public getButton() {
    return this.button;
  }

  private createP(): HTMLParagraphElement {
    const p = document.createElement('p');
    p.innerHTML = '<br>';
    return p;
  }

  private insertHTML(html) {
    let sel = window.getSelection(),
      range;
    const div = this.getHTML(html);
    const lastP = this.createP();

    if (window.getSelection()) {
      range = sel.getRangeAt(0);
    }
    if (this.$place) {
      const p = document.createElement('p');
      p.appendChild(div);
      this.$place.parentNode.replaceChild(p, this.$place);

      p.parentNode.insertBefore(this.createP(), p);
      if (p.nextElementSibling) {
        p.parentNode.insertBefore(this.createP(), p.nextElementSibling);
      } else {
        p.parentNode.appendChild(lastP);
      }
      return;
    }
    if (sel.rangeCount) {
      range.deleteContents();
      range.collapse(true);

      range.insertNode(this.createP());
      range.insertNode(div);
    }
    // Move the caret immediately after the inserted div
    range.insertNode(this.createP());
    range.setStartAfter(lastP);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  private getHTML(html) {
    const div = document.createElement('div');
    div.classList.add('medium-insert-embeds');
    div.setAttribute('contenteditable', 'false');
    div.innerHTML = `
        <figure>
          <div class="medium-insert-embed">
            ${html}
          </div>
        </figure>
        <div class="medium-insert-embeds-overlay"></div>`;
    return div;
  }

  public handleClick(event: any) {
    const src = this.window.getSelection().toString().trim();
    if (this.urlRegex.exec(src)) {
      this.processLink(src);
      this.base.checkContentChanged();
    }
  }

  public events() {
    this.base.subscribe('action-videos', (data, editable) => {
      let $place = this.$element.querySelector('.medium-insert-active');

      if (this.urlRegex.exec(data.link)) {
        this.$place = $place;
        this.processLink(data.link);
        this.base.checkContentChanged();
      }
    });
  }

  public prepare() {
    let elements = this.$element.querySelectorAll(
      '.medium-insert-embeds-overlay'
    );

    for (let i: number = 0; i < elements.length; ++i) {
      const item = elements[i];
      item.remove();
    }

    elements = this.$element.querySelectorAll('.medium-insert-embeds');
    for (let i: number = 0; i < elements.length; ++i) {
      const item = elements[i];
      item.setAttribute('contenteditable', 'false');
    }
  }

  public processLink(src) {
    const url = src.trim();

    if (url === '') {
      return;
    }

    this.parseUrl(url);
  }

  public async parseUrl(url, pasted = null) {
    let html;
    url = url.replace(/\n?/g, '');

    html = url
      .replace(
        /^((http(s)?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|v\/)?)([a-zA-Z0-9\-_]+)(.*)?$/,
        '<div class="video video-youtube"><iframe width="892" height="520" src="//www.youtube.com/embed/$7" frameborder="0" allowfullscreen></iframe></div>'
      )
      .replace(
        /^https?:\/\/vimeo\.com(\/.+)?\/([0-9]+)$/,
        '<div class="video video-vimeo"><iframe src="//player.vimeo.com/video/$2" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>'
      )
      .replace(
        /^https?:\/\/instagram\.com\/p\/(.+)\/?$/,
        '<span class="instagram"><iframe src="//instagram.com/p/$1/embed/" width="612" height="710" frameborder="0" scrolling="no" allowtransparency="true"></iframe></span>'
      )
      .replace(
        /^https?:\/\/www\.minds\.com\/media\/([0-9]+)\/?$/,
        `<span class="minds"><iframe src="https://www.minds.com/api/v1/embed/$1" width="720" height="320" frameborder="0" scrolling="no" allowtransparency="true"></video></iframe></span>`
      )
      .replace(
        /^https?:\/\/www\.minds\.com\/api\/v1\/embed\/([0-9]+)\/?$/,
        `<span class="minds"><iframe src="https://www.minds.com/api/v1/embed/$1" width="720" height="320" frameborder="0" scrolling="no" allowtransparency="true"></video></iframe></span>`
      );

    if (
      url.match(
        /^(https?:\/\/)?(www\.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+\/?$/g
      )
    ) {
      try {
        html = await this.getSoundcloudEmbed(url);
      } catch (e) {
        html = url;
      }
    }

    if (html === url) {
      return false;
    }

    if (this.options.storeMeta) {
      html +=
        '<div class="medium-insert-embeds-meta"><script type="text/json">' +
        JSON.stringify({}) +
        '</script></div>';
    }

    if (pasted) {
      this.embed(html, url);
    } else {
      this.embed(html);
    }
  }

  public embed(html, pastedUrl = null) {
    let $div;

    if (!html) {
      this.toasterService.error('Incorrect URL format specified');
      return false;
    }
    if (html.indexOf('</script>') > -1) {
      $div = document
        .createElement('div')
        .setAttribute(
          'data-embed-code',
          (document.createElement('div').innerText = html.innerHTML)
        );
      $div.innerHTML = html;
      html = document.createElement('div').appendChild($div).innerHTML;
    }

    this.insertHTML(html);
  }

  private getSoundcloudEmbed(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      JSONP.send(
        `http://soundcloud.com/oembed?format=js&url=${url}&callback=getSoundcloudEmbed`,
        {
          callbackName: 'getSoundcloudEmbed',
          onSuccess: function (json) {
            resolve(json.html);
          },
          onTimeout: function () {
            reject();
          },
          timeout: 10,
        }
      );
    });
  }
}

class JSONP {
  public static send(src, options) {
    var callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function () {},
      on_timeout = options.onTimeout || function () {},
      timeout = options.timeout || 10; // sec

    var timeout_trigger = window.setTimeout(function () {
      (window as any)[callback_name] = function () {};
      on_timeout();
      document.getElementsByTagName('head')[0].removeChild(script);
    }, timeout * 1000);

    (window as any)[callback_name] = function (data) {
      window.clearTimeout(timeout_trigger);
      on_success(data);
      document.getElementsByTagName('head')[0].removeChild(script);
    };

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
