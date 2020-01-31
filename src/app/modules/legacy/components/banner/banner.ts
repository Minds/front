import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../../services/api';

@Component({
  selector: 'minds-banner',
  inputs: [
    '_object: object',
    '_src: src',
    '_top: top',
    'overlay',
    '_editMode: editMode',
    '_done: done',
  ],
  outputs: ['added'],
  template: `
    <div class="minds-banner" *ngIf="!editing">
      <div
        class="minds-banner-img m-banner--img-cover"
        [style.backgroundImage]="src ? 'url(' + src + ')' : null"
      ></div>

      <div class="minds-banner-overlay"></div>
    </div>
    <div
      *ngIf="editing"
      class="minds-banner minds-banner-editing m-banner--img-cover"
      [style.backgroundImage]="src ? 'url(' + src + ')' : null"
    >
      <div class="overlay" [hidden]="file">
        <i class="material-icons">camera</i>
        <span i18n="@@MINDS__BANNER__ADD_NEW_BANNER_W_RECOMMENDATION">
          Click here to add a new banner<br />
          <em>Recommended minimum size 2000px &times; 1125px (Ratio 16:9)</em>
        </span>
      </div>
      <div class="minds-banner-overlay"></div>

      <button
        class="add-button mdl-button mdl-button--raised mdl-button--colored material-icons"
        title="Upload image to current banner carousel slide"
        (click)="onClick($event)"
      >
        <i class="material-icons">file_upload</i>
      </button>

      <div class="save-bar" [hidden]="!file">
        <div class="mdl-layout-spacer"></div>
        <span class="minds-button-edit cancel-button" (click)="cancel()">
          <button i18n="@@M__ACTION__CANCEL">Cancel</button>
        </span>
        <span class="minds-button-edit save-button" (click)="done()">
          <button i18n="@@M__ACTION__SAVE">Save</button>
        </span>
      </div>
      <input type="file" id="file" (change)="add($event)" [hidden]="file" />
    </div>
  `,
})
export class MindsBanner {
  object;
  editing: boolean = false;
  src: string = '';
  originalSrc: string = '';
  index: number = 0;

  file: any;
  startY: number = 0;
  offsetY: any = 0;
  top: number = 0;
  dragging: boolean = false;
  dragTimeout;
  added: EventEmitter<any> = new EventEmitter();
  overlay: any; // @todo: ??

  set _object(value: any) {
    if (!value) return;
    this.object = value;
    this.originalSrc = this.src =
      '/fs/v1/banners/' +
      this.object.guid +
      '/' +
      this.top +
      '/' +
      this.object.banner;
  }

  set _src(value: any) {
    this.originalSrc = this.src = value;
  }

  set _top(value: number) {
    if (!value) return;
    this.top = value;
  }

  set _editMode(value: boolean) {
    this.editing = value;
  }

  add(e) {
    if (!this.editing) return;

    var element: any = e.target ? e.target : e.srcElement;
    this.file = element ? element.files[0] : null;

    /**
     * Set a live preview
     */
    var reader = new FileReader();
    reader.onloadend = () => {
      this.src =
        typeof reader.result === 'string'
          ? reader.result
          : reader.result.toString();
    };
    reader.readAsDataURL(this.file);

    element.value = '';
  }

  cancel() {
    this.file = null;
    this.src = this.originalSrc;
  }

  /**
   * An upstream done event, which triggers the export process. Usually called from carousels
   */
  set _done(value: boolean) {
    if (value) this.done();
  }

  done() {
    this.added.next({
      index: this.index,
      file: this.file,
      top: this.top,
    });
    this.file = null;
    //this.editing = false;
  }

  onClick(e) {
    e.target.parentNode.parentNode.getElementsByTagName('input')[0].click();
  }
}
