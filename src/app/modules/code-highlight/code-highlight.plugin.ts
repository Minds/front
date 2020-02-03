import { CodeHighlightService } from './code-highlight.service';
import { codeHighlightWrapperClass } from './code-highlight.util';

type Options = { buttonText?: string };

export class CodeHighlightPlugin {
  button: HTMLButtonElement;
  options: any = { buttonText: '<b>Code</b>' };
  base: MediumEditor.MediumEditor;
  window;
  document;
  $element;
  form;
  action: string = 'highlightCode';
  hasForm: boolean = true;
  formActiveClass: string = 'medium-editor-toolbar-form-active';
  formSaveLabel: string = '&#10003;';
  formCloseLabel: string = '&times;';
  autoDetectLabel: string = 'Auto Detect Language';
  autoDetectValue: string = 'auto';
  private _foundCodeNode: boolean;

  /**
   * Informs medium-editor that it shouldn't use document.queryCommandState(),
   * but instead use this.queryCommandState()
   */
  useQueryState: boolean = false;

  constructor(
    private codeHighlightService: CodeHighlightService,
    options: Options
  ) {
    this.options = { ...options };
  }

  public init() {
    this.$element = document.querySelector('.medium-editor-element');
  }

  public getButton() {
    if (!this.button) {
      this.button = this.createButton();
    }

    return this.button;
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');

    button.classList.add('medium-editor-action');
    button.innerHTML = this.options.buttonText;
    button.onclick = this.handleClick.bind(this);

    return button;
  }

  public handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isSelectionAlreadyWrapped()) {
      this.base.saveSelection();
      this.unwrapHTML();
      this.setInactive();
      this.base.restoreSelection();
      this.base.checkSelection();
    } else if (!this.isDisplayed()) {
      this.showForm();
    }

    return false;
  }

  public getForm() {
    if (!this.form) {
      this.form = this.createForm();
    }
    return this.form;
  }

  public destroy() {
    if (!this.form) {
      return false;
    }

    if (this.form.parentNode) {
      this.form.parentNode.removeChild(this.form);
    }

    delete this.form;
  }

  public isDisplayed(): boolean {
    if (this.hasForm) {
      return this.getForm().classList.contains(this.formActiveClass);
    }
  }

  /**
   *  Called by medium-editor to hide this extension's user input form
   */
  public hideForm() {
    if (this.hasForm) {
      return this.getForm().classList.remove(this.formActiveClass);
    }
  }

  /**
   * Called by medium-editor on each node within a selected range whenever a
   * selection change is made.
   *
   * This method checks to see if a node contains the
   * codeHighlightWrapperClass. Upon reaching the editor node, toggle this
   * extension's button's activeButtonClass if a node with the
   * codeHighlightWrapperClass was found along the way.
   *
   * @param node
   */
  public checkState(node) {
    if (
      !this._foundCodeNode &&
      node.classList.contains(codeHighlightWrapperClass)
    ) {
      this._foundCodeNode = true;
    }

    if (this.isMediumEditor(node)) {
      if (this._foundCodeNode) {
        this.setActive();
      } else {
        this.setInactive();
      }

      delete this._foundCodeNode;
    }
  }

  private isMediumEditor(node) {
    return (
      node &&
      node.getAttribute &&
      !!node.getAttribute('data-medium-editor-element')
    );
  }

  public setActive() {
    this.button.classList.add(this.getEditorOption('activeButtonClass'));
  }

  public setInactive() {
    this.button.classList.remove(this.getEditorOption('activeButtonClass'));
  }

  private getEditorOption(option: string) {
    return this.base.options[option];
  }

  private showForm(opts?) {
    let selectElement = this.getSelectElement();

    opts = opts || { value: this.autoDetectValue };

    this.base.saveSelection();
    this.hideToolbarDefaultActions();
    this.getForm().classList.add(this.formActiveClass);
    this.setToolbarPosition();

    selectElement.value = opts.value;
    selectElement.focus();
  }

  private createForm() {
    const selectNode = document.createElement('select');
    selectNode.classList.add('medium-editor-toolbar-input');

    const autoDetectOptionNode = document.createElement('option');
    autoDetectOptionNode.setAttribute('selected', 'selected');
    autoDetectOptionNode.setAttribute('value', this.autoDetectValue);
    autoDetectOptionNode.appendChild(
      document.createTextNode(this.autoDetectLabel)
    );
    selectNode.appendChild(autoDetectOptionNode);

    const languages = this.codeHighlightService.getLanguages();
    for (let i = 0; i < languages.length; ++i) {
      const languageOptionNode = document.createElement('option');
      languageOptionNode.setAttribute('value', languages[i]);
      languageOptionNode.appendChild(document.createTextNode(languages[i]));
      selectNode.appendChild(languageOptionNode);
    }

    let saveAnchorNode = document.createElement('a');
    saveAnchorNode.classList.add('medium-editor-toolbar-save');
    saveAnchorNode.setAttribute('href', '#');
    saveAnchorNode.innerHTML = this.formSaveLabel;

    let closeAnchorNode = document.createElement('a');
    closeAnchorNode.classList.add('medium-editor-toolbar-close');
    closeAnchorNode.setAttribute('href', '#');
    closeAnchorNode.innerHTML = this.formCloseLabel;

    const form = document.createElement('div');

    form.classList.add('medium-editor-toolbar-form');
    form.setAttribute(
      'id',
      `medium-editor-toolbar-form-code-language-${this.base.id}`
    );
    form.append(selectNode, saveAnchorNode, closeAnchorNode);
    this.attachFormEvents(form);

    return form;
  }

  private attachFormEvents(form: HTMLDivElement) {
    const close: HTMLElement = form.querySelector(
        '.medium-editor-toolbar-close'
      ),
      save: HTMLElement = form.querySelector('.medium-editor-toolbar-save'),
      input: HTMLElement = form.querySelector('.medium-editor-toolbar-input');

    // Handle clicks on the form itself
    this.base.on(form, 'click', this.handleFormClick.bind(this), false);

    // Handle typing in the textbox
    this.base.on(input, 'keyup', this.handleTextboxKeyup.bind(this), false);

    // Handle close button clicks
    this.base.on(close, 'click', this.handleCloseClick.bind(this), false);

    // Handle save button clicks (capture)
    this.base.on(save, 'click', this.handleSaveClick.bind(this), true);
  }

  private getFormOpts() {
    let value = this.getSelectElement().value.trim();

    return {
      value: value ? value : this.autoDetectValue,
    };
  }

  private doFormSave() {
    const opts = this.getFormOpts();
    this.completeFormSave(opts);
  }

  private doFormCancel() {
    this.base.restoreSelection();
    this.base.checkSelection();
  }

  private completeFormSave(opts) {
    this.base.saveSelection();
    this.wrapWithHTML(opts.value);
    this.base.restoreSelection();
    this.base.checkSelection();
  }

  private handleTextboxKeyup(event) {
    // For ENTER -> create the anchor (keyCode 13)
    if (event.keyCode === 13) {
      event.preventDefault();
      this.doFormSave();
      return;
    }

    // For ESCAPE -> close the form (keyCode 27)
    if (event.keyCode === 27) {
      event.preventDefault();
      this.doFormCancel();
    }
  }

  private handleFormClick(event) {
    event.stopPropagation();
  }

  private handleCloseClick(event) {
    event.preventDefault();
    this.doFormCancel();
  }

  private handleSaveClick(event) {
    event.preventDefault();
    this.doFormSave();
  }

  private getSelectElement() {
    return this.getForm().querySelector('select.medium-editor-toolbar-input');
  }

  private hideToolbarDefaultActions() {
    const toolbar = this.base.getExtensionByName('toolbar');
    if (toolbar) {
      toolbar.hideToolbarDefaultActions();
    }
  }

  private setToolbarPosition() {
    const toolbar = this.base.getExtensionByName('toolbar');
    if (toolbar) {
      toolbar.setToolbarPosition();
    }
  }

  private prepareSelectionContent(content: string) {
    // NB: medium-editor adds extra newlines, this remove them
    return content.replace(/\n\n/g, '\n');
  }

  private isSelectionAlreadyWrapped(): boolean {
    let sel = window.getSelection(),
      range;

    if (this.window.getSelection && (sel = window.getSelection()).rangeCount) {
      range = sel.getRangeAt(0);
      const startNode = range.startContainer.parentNode;
      const endNode = range.endContainer.parentNode;

      if (
        (startNode.nodeName.toLowerCase() === 'div' &&
          startNode.classList.contains(codeHighlightWrapperClass)) ||
        (endNode.nodeName.toLowerCase() === 'div' &&
          endNode.classList.contains(codeHighlightWrapperClass))
      ) {
        console.log('isSelectionAlreadyWrapped() -> true');
        return true;
      }
    }
    console.log('isSelectionAlreadyWrapped() -> false');
    return false;
  }

  private unwrapHTML() {
    let sel;

    if (window.getSelection && (sel = window.getSelection()).rangeCount) {
      const range = sel.getRangeAt(0);
      const pNode = document.createElement('p');

      pNode.appendChild(
        document.createTextNode(range.startContainer.textContent)
      );
      range.startContainer.parentNode.replaceWith(pNode);
    }
  }

  private wrapWithHTML(language: string) {
    let sel = window.getSelection();

    if (window.getSelection && (sel = window.getSelection()).rangeCount) {
      const content = this.prepareSelectionContent(sel.toString().trim());
      const range = sel.getRangeAt(0);

      // TODO -> Fix this method to be usable with single line and multi-line
      //         selection, matching the blockquote action behavior

      // console.log('wrapWithHTML() -> content', content);
      // console.log('wrapWithHTML() -> range.startContainer', range.startContainer);
      // console.log('wrapWithHTML() -> range.endContainer', range.startContainer);

      const startNode = range.startContainer.parentNode;
      const endNode = range.endContainer.parentNode;

      // console.log('wrapWithHTML() -> startNode', startNode);
      // console.log('wrapWithHTML() -> endNode', startNode);

      range.deleteContents();
      range.collapse(true);

      const divNode = document.createElement('div');
      divNode.classList.add(codeHighlightWrapperClass);
      divNode.appendChild(document.createTextNode(content));

      range.insertNode(divNode);
      range.setStartAfter(divNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  public prepare() {
    let elements = this.$element.querySelectorAll(codeHighlightWrapperClass);

    for (let i: number = 0; i < elements.length; ++i) {
      elements[i].setAttribute('contenteditable', 'false');
    }
  }
}
