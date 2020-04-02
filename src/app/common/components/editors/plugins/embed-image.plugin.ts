import Editor = MediumEditor.MediumEditor;
import { ConfigsService } from '../../../services/configs.service';

type Options = { buttonText?: string; placeholder?: string };

export class EmbedImage {
  readonly siteUrl: string;
  button: HTMLButtonElement;
  options: any = { placeholder: '' };
  base: Editor;
  window;
  document;
  private _serializePreImages: Function;
  $element;
  $currentImage;
  private readonly urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

  constructor(options: Options, configs: ConfigsService) {
    this.options = { ...options };
    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action';
    this.button.innerHTML = options.buttonText || '</>';
    this.button.onclick = this.handleClick.bind(this);
    this.siteUrl = configs.get('site_url');
  }

  public init() {
    this._serializePreImages = this.base.serialize;
    this.base.serialize = this.editorSerialize.bind(this);
    this.$element = document.querySelector('.medium-editor-element');

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

  private upgradeSpinner($place: HTMLElement) {
    const spinner = $place.querySelector('.mdl-spinner');
    if (spinner) {
      window.componentHandler.upgradeElement(spinner);
    }
  }

  private insertHTML(
    imgSrc: string,
    $place: HTMLElement = null,
    timestamp: string = ''
  ) {
    let sel = window.getSelection(),
      range;
    const div = this.getHTML(imgSrc, timestamp);

    if ($place) {
      const p = document.createElement('p');
      p.appendChild(div);
      $place.parentNode.replaceChild(p, $place);

      p.parentNode.insertBefore(this.createP(), p);
      if (p.nextElementSibling) {
        p.parentNode.insertBefore(this.createP(), p.nextElementSibling);
      } else {
        p.parentNode.appendChild(this.createP());
      }
      this.upgradeSpinner(div);
      return;
    }
    if (window.getSelection && (sel = window.getSelection()).rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.collapse(true);

      const div = this.getHTML(imgSrc, timestamp);

      range.insertNode(this.createP());
      range.insertNode(div);
      const p = this.createP();
      range.insertNode(p);

      // Move the caret immediately after the inserted div
      range.setStartAfter(p);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);

      this.upgradeSpinner(div);
    }
  }

  private getHTML(imgSrc: string, timestamp: string = '') {
    const div = document.createElement('div');
    div.classList.add('m-blog--image');
    div.classList.add('medium-insert-images');
    div.setAttribute('contenteditable', 'false');

    let inProgressOverlay: HTMLDivElement = null;
    let spinner: HTMLDivElement = null;

    const img = document.createElement('img');

    timestamp.trim();
    if (timestamp !== '') {
      img.classList.add('medium-image-preview-' + timestamp);

      inProgressOverlay = document.createElement('div');
      inProgressOverlay.classList.add('m-blog--image--in-progress-overlay');

      spinner = document.createElement('div');
      spinner.classList.add('mdl-spinner', 'mdl-js-spinner', 'is-active');
      window.componentHandler.upgradeElement(spinner);

      inProgressOverlay.appendChild(spinner);
    }

    img.src = imgSrc;
    img.onerror = function() {
      this.classList.add('m--img-not-found');
    };
    img.addEventListener('click', this.selectImage.bind(this));

    div.appendChild(img);

    const span = document.createElement('span');
    span.classList.add('m-blog--image-caption');
    span.textContent = this.options.placeholder;
    span.addEventListener('click', this.selectImage.bind(this));

    div.appendChild(span);

    if (inProgressOverlay) {
      div.appendChild(inProgressOverlay);
    }
    return div;
  }

  public handleClick(event: any) {
    const src = this.window
      .getSelection()
      .toString()
      .trim();

    if (this.urlRegex.exec(src)) {
      this.insertHTML(src);
    }

    this.base.checkContentChanged();
  }

  /**
   * Event handler registration.
   */
  public events() {
    /* prevent default image drag&drop */
    this.$element.addEventListener('dragover', e => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.$element.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();
    });

    this.$element.addEventListener('keypress', e => {
      if (e.keyCode == 13) {
        this.unselectImage(e);
      }
    });

    document.addEventListener('click', this.unselectImage.bind(this));

    this.$element.addEventListener('click', this.selectImage.bind(this));

    this.base.subscribe('action-images', (data, editable) => {
      let $place = this.$element.querySelector('.medium-insert-active');
      this.insertHTML(data.link, $place, '');
    });

    this.window.addEventListener(
      'attachment-preview-loaded',
      (event: CustomEvent) => {
        let $place = this.$element.querySelector('.medium-insert-active');
        this.insertHTML(event.detail.src, $place, event.detail.timestamp);
      }
    );

    this.window.addEventListener(
      'attachment-upload-finished',
      (event: CustomEvent) => {
        const imgClass: string =
          'medium-image-preview-' + event.detail.timestamp;

        const image: HTMLImageElement = this.$element.querySelector(
          '.' + imgClass
        );

        if (!image) {
          return;
        }

        const overlay = image.parentElement.querySelector(
          '.m-blog--image--in-progress-overlay'
        );
        overlay.parentElement.removeChild(overlay);
        image.classList.remove(imgClass);

        image.setAttribute(
          'src',
          this.siteUrl + 'fs/v1/thumbnail/' + event.detail.guid
        );
      }
    );
  }

  public editorSerialize() {
    const data = this._serializePreImages();

    for (let i: number = 0; i < data.length; ++i) {
      const key = data[i];

      let $data: HTMLDivElement = document.createElement('div');
      $data.innerHTML = data[key].value;

      $data
        .querySelector('.medium-insert-images')
        .querySelector('figcaption, figure')
        .removeAttribute('contenteditable');
      data[key].value = $data.innerHTML;
    }

    return data;
  }

  /**
   * On image select, responds to image click.
   * @param { event }  e - event from DOM.
   */
  public selectImage(e) {
    let $image = e.target;

    if (!$image || $image.tagName === null) {
      return;
    }

    if ($image.tagName === 'SPAN') {
      $image = $image.parentNode.querySelector('img');
    }

    if (!$image || $image.tagName !== 'IMG') {
      return;
    }

    this.$currentImage = $image;

    $image.classList.add('medium-insert-image-active');
    (<any>$image.parentNode).setAttribute('contenteditable', 'true');

    const caption: HTMLSpanElement = $image.nextSibling;
    caption.setAttribute('contenteditable', 'true');

    if (caption === e.target) {
      if (caption.textContent.trim() === this.options.placeholder) {
        caption.textContent = '';
      }
    }

    event.stopPropagation();
  }

  /**
   * On image deselect, called when image clicked away from.
   * @param { event }  e - event from DOM.
   */
  public unselectImage(e) {
    let $el = e.target,
      $image = document.querySelector('.medium-insert-image-active');

    if (!$image || !$el || $el.tagName === null) {
      return;
    }

    if (
      $el.tagName === 'IMG' &&
      $el.classList.contains('medium-insert-image-active')
    ) {
      if ($image !== $el) {
        $image.classList.remove('medium-insert-image-active');
        (<any>$image.parentNode).setAttribute('contenteditable', 'false');
        const caption = $el.nextSibling;
        caption.setAttribute('contenteditable', false);
        if (caption.textContent.includes(this.options.placeholder)) {
          caption.textContent = '';
        }

        return;
      }
    } else if ($el.tagName === 'SPAN' && $image.nextSibling === $el) {
      return;
    }

    $image.classList.remove('medium-insert-image-active');
    (<any>$image.parentNode).setAttribute('contenteditable', 'false');

    const caption = $image.nextSibling;
    (<any>caption).setAttribute('contenteditable', false);
    if (caption.textContent.trim() === '') {
      caption.textContent = this.options.placeholder;
    }

    this.$currentImage = null;
  }

  /**
   * Move caret at the beginning of the empty paragraph
   */
  private moveCaret($el, position = 0) {
    let range, sel, el, textEl;

    range = document.createRange();
    sel = window.getSelection();
    el = $el;

    if (!el.childNodes.length) {
      textEl = document.createTextNode(' ');
      el.appendChild(textEl);
    }

    range.setStart(el.childNodes[0], position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  public prepare() {
    let elements = this.$element.querySelectorAll('.m-blog--image');

    for (let i: number = 0; i < elements.length; ++i) {
      const item = elements[i];

      item.setAttribute('contenteditable', 'false');
      const caption = item.querySelector('.m-blog--image-caption');
      if (caption.textContent === this.options.placeholder) {
        caption.textContent = '';
      }
    }

    for (let i: number = 0; i < elements.length; ++i) {
      const item = elements[i];
      item.setAttribute('contenteditable', 'false');
      const caption = item.querySelector('.m-blog--image-caption');
      if (caption.textContent === this.options.placeholder) {
        caption.textContent = '';
      }
    }
  }
}
