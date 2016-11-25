import {
  Component,
  OnChanges,
  ViewChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
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
    ></div>
    <span
      *ngIf="placeholder && model.length === 0"
      class="m-placeholder"
    >{{ placeholder }}</span>
  `,
  exportAs: "Textarea"
})
  
export class Textarea implements OnChanges {
  @ViewChild('editor') editorControl: ElementRef;

  @Input('mModel') model: string = '';
  @Output('mModelChange') update: EventEmitter<any> = new EventEmitter();

  @Input('disabled') disabled: boolean = false;
  @Input('placeholder') placeholder: string = '';

  getControlText(): string {
    return this.editorControl.nativeElement.innerText;
  }

  setControlText(value: string) {
    this.editorControl.nativeElement.innerText = value; 
  }

  focus() {
    this.editorControl.nativeElement.focus();
  }

  blur() {
    this.editorControl.nativeElement.blur();
  }
  
  change() {
    this.update.emit(this.getControlText());
  }

  paste(e: any) {
    e.preventDefault();

    if (e.clipboardData && e.clipboardData.getData) {
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    } else if ((<any> window).clipboardData && (<any> window).clipboardData.getData) {
      var text = (<any> window).clipboardData.getData("Text");
      this.insertTextAtCursor(text);
    }
  }

  ngOnChanges(changes: { model: SimpleChange, disabled: SimpleChange }) {
    if (
      changes.model &&
      this.getControlText() !== changes.model.currentValue && 
      (
        changes.model.isFirstChange() ||
        changes.model.previousValue !== changes.model.currentValue
      )
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
    } else if ((<any>document).selection && (<any>document).selection.createRange) {
      (<any>document).selection.createRange().text = text;
    }
  }
}
