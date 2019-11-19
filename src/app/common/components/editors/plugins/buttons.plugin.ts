import Editor = MediumEditor.MediumEditor;

type Options = { buttonText: string };

export class ButtonsPlugin {
  button: HTMLButtonElement;
  options: any = {
    addons: {
      images: `<i class="material-icons">photo</i>`,
      videos: `<i class="material-icons">camera</i>`,
    },
    enabled: true,
    uploadFunction: () => {},
  };
  base: Editor;
  window;
  document;
  $element;
  $selectedButton;
  private updated: boolean = false;

  private wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  constructor(options = {}) {
    this.options = { ...options };
  }

  public init() {
    this.$element = document.querySelector('.medium-editor-element');

    this.$element.classList.add('medium-editor-insert-plugin');

    if (
      typeof this.options.addons !== 'object' ||
      Object.keys(this.options.addons).length === 0
    ) {
      this.disable();
    }

    this.events();

    this.base.subscribe('editableInput', () => {
      if (this.updated) {
        return;
      }
      this.updated = true;
      this.clean();
    });
  }

  public events() {
    this.$element.addEventListener('keyup', this.toggleButtons.bind(this));
    this.$element.addEventListener('click', this.toggleButtons.bind(this));

    window.addEventListener('resize', this.positionButtons.bind(this));
  }

  getButtons() {
    const keys = Object.keys(this.options.addons);

    const div = document.createElement('div');
    div.classList.add('medium-insert-buttons');
    div.setAttribute('contenteditable', 'false');
    div.setAttribute('spellcheck', 'false');
    div.style.display = 'none';
    div.addEventListener('selectstart', this.disableSelection.bind(this));
    div.addEventListener('mousedown', this.disableSelection.bind(this));

    const button = document.createElement('button');
    button.classList.add('medium-insert-buttons-show');
    button.setAttribute('type', 'button');
    button.addEventListener('mousedown', this.toggleAddons.bind(this));

    button.innerText = '+';
    div.appendChild(button);

    const ul = document.createElement('ul');
    ul.classList.add('medium-insert-buttons-addons');

    for (let i: number = 0; i < keys.length; ++i) {
      const item = keys[i];

      const li = document.createElement('li');
      const button2 = document.createElement('button');
      button2.setAttribute('data-addon', item);
      button2.setAttribute('data-action', 'add');
      button2.setAttribute('type', 'button');
      button2.classList.add('medium-insert-action');
      button2.innerHTML = this.options.addons[item];
      button2.addEventListener('click', this.showInput.bind(this));
      li.appendChild(button2);

      ul.appendChild(li);
    }
    div.appendChild(ul);

    const fileInput: HTMLInputElement = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.classList.add('medium-media-file-input');
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', this.uploadFile.bind(this));

    div.appendChild(fileInput);

    return div;
  }

  /**
   * Disables the plugin
   */
  public disable() {
    this.options.enabled = false;

    this.$element.querySelector('.medium-insert-buttons').classList.add('hide');
  }

  private createP(): HTMLParagraphElement {
    const p = document.createElement('p');
    p.innerHTML = '<br>';
    return p;
  }

  public clean() {
    let $buttons: HTMLElement, $lastEl, $text;

    if (this.options.enabled === false) {
      return;
    }
    if (!this.$element.children || this.$element.children.length === 0) {
      this.$element.innerHTML = `<p><br></p>`;
    } else if (!this.$element.querySelector('p')) {
      this.$element.insertBefore(this.createP(), this.$element.firstChild);
      this.$element.appendChild(this.createP());
    }

    $text = [];
    for (let i: number = 0; i < this.$element.children.length; ++i) {
      const $child = this.$element.children[i];
      if (
        ($child.nodeName === '#text' && $child.textContent.trim() !== '') ||
        $child.nodeName.toLowerCase() === 'br'
      ) {
        $text.push($child);
      }
    }

    for (let i: number = 0; i < $text.length; ++i) {
      const item = $text[i];
      this.wrap(item, document.createElement('p'));

      this.moveCaret(item.parentNode, item.textContent.length);
    }

    this.addButtons();

    $buttons = this.$element.querySelector('.medium-insert-buttons');
    $lastEl = $buttons.previousElementSibling;
    if (
      $lastEl.getAttribute('class') &&
      $lastEl.getAttribute('class').match(/medium\-insert(?!\-active)/)
    ) {
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      $buttons.parentNode.insertBefore(p, $buttons);
    }
  }

  /**
   * Move caret at the beginning of the empty paragraph
   */
  public moveCaret($el, position) {
    let range, sel, el, textEl;

    position = position || 0;
    range = document.createRange();
    sel = window.getSelection();
    el = $el.get(0);

    if (!el.childNodes.length) {
      textEl = document.createTextNode(' ');
      el.appendChild(textEl);
    }

    range.setStart(el.childNodes[0], position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Appends buttons at the end of the $el
   */
  public addButtons() {
    if (!this.$element.querySelector('.medium-insert-buttons')) {
      this.$element.appendChild(this.getButtons());
    }
  }

  /**
   * Position buttons
   */
  public positionButtons(activeAddon) {
    let $buttons = this.$element.querySelector('.medium-insert-buttons');
    let $p = this.$element.querySelector('.medium-insert-active');

    if (!$buttons) {
      return;
    }

    if ($p !== null) {
      let $lastCaption = $p.classList.contains('medium-insert-images-grid')
          ? []
          : $p.querySelector(
              '* .medium-insert-images:last-child .m-blog--image-caption'
            ),
        elementsContainer = (<any>this.base).options.elementsContainer,
        elementsContainerAbsolute =
          ['absolute', 'fixed'].indexOf(
            window
              .getComputedStyle(elementsContainer)
              .getPropertyValue('position')
          ) > -1;

      const pRect = $p.getBoundingClientRect();

      $buttons.style.left = pRect.left + document.body.scrollLeft - 40 + 'px';
      $buttons.style.top = pRect.top + document.body.scrollTop + 'px';

      if (activeAddon) {
        $buttons.style.left +=
          pRect.width -
          $buttons
            .querySelector('.medium-insert-buttons-show')
            .getBoundingClientRect().width -
          10 +
          'px';
        $buttons.style.top +=
          pRect.width -
          20 +
          ($lastCaption
            ? -$lastCaption.getBoundingClientRect().height -
              parseInt($lastCaption.style.marginTop, 10)
            : 10) +
          'px';
      } else {
        $buttons.style.top += parseInt($p.style.marginTop, 10) + 'px';
      }

      if (elementsContainerAbsolute) {
        $buttons.style.top += elementsContainer.scrollTop + 'px';
      }

      if (
        this.$element.classList.contains('medium-editor-placeholder') ===
          false &&
        $buttons.getBoundingClientRect().left < 0
      ) {
        $buttons.style.left = pRect.left + 'px';
      }
    }
  }

  private closestByClass(el, tag) {
    tag = tag.toUpperCase();
    do {
      if (el.nodeName === tag) {
        return el;
      }
    } while ((el = el.parentNode));
    return null;
  }

  /**
   * Move buttons to current active, empty paragraph and show them
   */
  private toggleButtons(e) {
    let $el = e.target,
      selection = window.getSelection(),
      range,
      $current,
      $p,
      activeAddon;

    if (this.options.enabled === false) {
      return;
    }

    if (!selection || selection.rangeCount === 0) {
      $current = $el;
    } else {
      range = selection.getRangeAt(0);
      $current = range.commonAncestorContainer;
    }

    // When user clicks on  editor's placeholder in FF, $current el is editor itself, not the first paragraph as it should
    if (
      $current.classList &&
      $current.classList.contains('medium-editor-insert-plugin')
    ) {
      $current = $current.querySelector('* p:first-child');
    }

    $p =
      $current && $current.tagName === 'P'
        ? $current
        : this.closestByClass($current, 'p');

    this.clean();

    if (
      $el.classList.contains('medium-editor-placeholder') === false &&
      !this.closestByClass($el, '.medium-insert-buttons') &&
      !this.closestByClass($current, '.medium-insert-buttons')
    ) {
      if (this.$element.querySelector('.medium-insert-active')) {
        this.$element
          .querySelector('.medium-insert-active')
          .classList.remove('medium-insert-active');
      }

      const addons = Object.keys(this.options.addons);
      for (let i: number = 0; i < addons.length; ++i) {
        const addon = addons[i];

        if (this.closestByClass($el, '.medium-insert-' + addon)) {
          $current = $el;
        }

        if (this.closestByClass($current, '.medium-insert-' + addon)) {
          $p = this.closestByClass($current, '.medium-insert-' + addon);
          activeAddon = addon;
          return;
        }
      }

      if (
        $p &&
        (($p.innerText.trim() === '' && !activeAddon) ||
          activeAddon === 'images')
      ) {
        $p.classList.add('medium-insert-active');

        if (activeAddon === 'images') {
          this.$element
            .querySelector('.medium-insert-buttons')
            .setAttribute('data-active-addon', activeAddon);
        } else {
          this.$element
            .querySelector('.medium-insert-buttons')
            .removeAttribute('data-active-addon');
        }

        // If buttons are displayed on addon paragraph, wait 100ms for possible captions to display
        setTimeout(
          () => {
            this.positionButtons(activeAddon);
            this.showButtons(activeAddon);
          },
          activeAddon ? 100 : 0
        );
      } else {
        this.hideButtons();
      }
    }
  }

  /**
   * Show buttons
   */
  private showButtons(activeAddon) {
    const $buttons = this.$element.querySelector('.medium-insert-buttons');

    $buttons.style.display = '';
    const $lis = $buttons.querySelectorAll('li');
    for (let i: number = 0; i < $lis.length; ++i) {
      const $li: HTMLElement = $lis[i];
      $li.style.display = '';
    }

    if (activeAddon) {
      $buttons.querySelector('li').style.display = 'none';
      $buttons.querySelector(
        'button[data-addon="' + activeAddon + '"]'
      ).parentNode.style.display = '';
    }
  }

  private hideButtons($el = null) {
    $el = $el || this.$element;

    $el.querySelector('.medium-insert-buttons').style.display = 'none';
    $el
      .querySelector('.medium-insert-buttons-addons')
      .classList.remove('medium-insert-buttons-addons-show');
    $el
      .querySelector('.medium-insert-buttons-show')
      .classList.remove('medium-insert-buttons-rotate');
  }

  /**
   * Disables selectstart mousedown events on plugin elements except images
   */
  private disableSelection(e) {
    const $el = e.target;

    if (
      $el.tagName !== 'IMG' ||
      $el.classList.contains('medium-insert-buttons-show')
    ) {
      e.preventDefault();
    }
  }

  /**
   * toggles addons buttons
   */
  private toggleAddons() {
    let $addons = this.$element.querySelector('.medium-insert-buttons-addons');
    if ($addons.classList.contains('medium-insert-buttons-addons-show')) {
      $addons.classList.remove('medium-insert-buttons-addons-show');
    } else {
      $addons.classList.add('medium-insert-buttons-addons-show');
    }
    ButtonsPlugin.toggleClass(
      this.$element.querySelector('.medium-insert-buttons-show'),
      'medium-insert-buttons-rotate'
    );
    this.hideInput();
  }

  private static toggleClass($el, className) {
    if ($el.classList.contains(className)) {
      $el.classList.remove(className);
    } else {
      $el.classList.add(className);
    }
  }

  private hideInput() {
    const $input = this.$element.querySelector('.medium-media-buttons');

    if ($input) {
      try {
        $input.parentNode.removeChild($input);
      } catch (e) {}
    }
  }

  private showInput(e) {
    this.toggleAddons();
    this.hideButtons();
    let $a = e.currentTarget;

    let $place = this.$element.querySelector('.medium-insert-active');

    // empty <p> tag so the input doesn't look wrong
    while ($place.firstChild) {
      $place.removeChild($place.firstChild);
    }

    const div: HTMLDivElement = document.createElement('div');
    div.setAttribute('contenteditable', 'false');
    div.classList.add('medium-media-buttons');

    if ($a.getAttribute('data-addon') === 'images') {
      const uploadButton: HTMLButtonElement = document.createElement('button');
      uploadButton.setAttribute('type', 'button');
      uploadButton.classList.add('medium-media-buttons-upload');
      uploadButton.innerHTML = `<i class="material-icons file-upload"></i>`;

      uploadButton.addEventListener(
        'mousedown',
        this.chooseFile.bind(this),
        true
      );

      uploadButton.onblur = () => {
        if (div && div.parentNode) {
          div.parentNode.replaceChild(document.createElement('br'), div);
        }
      };

      div.appendChild(uploadButton);
    }

    const input: HTMLInputElement = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', this.options.placeholder);
    input.classList.add('medium-insert-link-input');

    input.addEventListener('keypress', e => {
      if (e.keyCode == 13) {
        this.addonAction($a, input.value);
        e.preventDefault();
      }
    });

    input.onblur = () => {
      if (div && div.parentNode) {
        div.parentNode.replaceChild(document.createElement('br'), div);
      }
    };

    input.addEventListener('keydown', (e: any) => {
      if ((!e.ctrlKey && !e.metaKey) || e.keyCode != 86) {
        return;
      }
      e.stopPropagation();
    });

    input.addEventListener(
      'paste',
      (e: ClipboardEvent) => {
        input.value = e.clipboardData.getData('text/plain');
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );

    div.appendChild(input);

    $place.appendChild(div);

    input.focus();
  }

  private chooseFile() {
    let $place = this.$element.querySelector('.medium-insert-active');

    const fileInput = this.$element.querySelector('.medium-media-file-input');

    fileInput.click();
  }

  private uploadFile() {
    const fileInput = this.$element.querySelector('.medium-media-file-input');

    const file = fileInput ? fileInput.files[0] : null;

    let reader = new FileReader();

    const timestamp = Date.now().toString();

    reader.onloadend = () => {
      this.window.dispatchEvent(
        new CustomEvent('attachment-preview-loaded', {
          detail: {
            timestamp: timestamp,
            src: reader.result,
          },
        })
      );
    };
    reader.readAsDataURL(file);

    this.options.uploadFunction(fileInput).then(result => {
      this.window.dispatchEvent(
        new CustomEvent('attachment-upload-finished', {
          detail: {
            timestamp: timestamp,
            guid: result,
          },
        })
      );
    });
  }

  /**
   * Call addon action
   * @param target
   * @param link
   */
  private addonAction(target, link) {
    this.base.trigger(
      'action-' + target.getAttribute('data-addon'),
      {
        link: link,
        rangeStart: this.$element.querySelector('.medium-insert-active'),
      },
      this.$element
    );
  }

  public prepare() {
    let buttons = this.$element.querySelectorAll('.medium-insert-buttons');
    for (let i: number = 0; i < buttons.length; ++i) {
      buttons[i].parentNode.removeChild(buttons[i]);
    }
  }
}
