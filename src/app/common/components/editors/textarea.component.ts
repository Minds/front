import {
  Component,
  OnChanges,
  ViewChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

declare var tinymce;

@Component({
  selector: 'minds-textarea',
  template: `
    <div
      #editor
      class="m-editor"
      [ngClass]="{ 'm-editor-disabled': disabled }"
      [attr.contenteditable]="!disabled ? 'true' : null"
      (keyup)="change()"
      (blur)="change()"
      (paste)="paste($event); change()"
      (filePaste)="filePaste.emit($event)"
      m-attachment-paste
      tabindex="0"
    ></div>
    <span *ngIf="placeholder && model.length === 0" class="m-placeholder">{{
      placeholder
    }}</span>
  `,
  exportAs: 'Textarea',
})
export class Textarea implements OnChanges {
  @ViewChild('editor', { static: true }) editorControl: ElementRef;

  @Input('mModel') model: string = '';
  @Output('mModelChange') update: EventEmitter<any> = new EventEmitter();

  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';

  @Output()
  filePaste: EventEmitter<File> = new EventEmitter<File>();

  getControlText(): string {
    return this.editorControl.nativeElement.innerText;
  }

  setControlText(value: string) {
    this.editorControl.nativeElement.innerText = value;
  }

  focus() {
    this.editorControl.nativeElement.focus();
    this._placeCaretAtEnd(this.editorControl.nativeElement);
  }

  blur() {
    this.editorControl.nativeElement.blur();
  }

  change() {
    this.update.emit(this.getControlText());
  }

  paste(e: any) {
    e.preventDefault();

    let text;

    if (e.clipboardData && e.clipboardData.getData) {
      text = e.clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, text);
    } else if (
      (<any>window).clipboardData &&
      (<any>window).clipboardData.getData
    ) {
      text = (<any>window).clipboardData.getData('Text');
      this.insertTextAtCursor(text);
    }
  }

  ngOnChanges(changes: any) {
    if (
      changes.model &&
      this.getControlText() !== changes.model.currentValue &&
      (changes.model.isFirstChange() ||
        changes.model.previousValue !== changes.model.currentValue)
    ) {
      this.setControlText(this.model);
    }

    if (changes.disabled && changes.disabled.currentValue) {
      this.blur();
    }
  }

  //

  private insertTextAtCursor(text: string) {
    let sel, range, html;

    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      }
    } else if (
      (<any>document).selection &&
      (<any>document).selection.createRange
    ) {
      (<any>document).selection.createRange().text = text;
    }
  }

  private _placeCaretAtEnd(el: HTMLElement) {
    if (
      typeof window.getSelection !== 'undefined' &&
      typeof document.createRange !== 'undefined'
    ) {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof (<any>document.body).createTextRange !== 'undefined') {
      var textRange = (<any>document.body).createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }
}
