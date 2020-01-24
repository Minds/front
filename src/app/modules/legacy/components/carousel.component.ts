import { Component, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { Client } from '../../../services/api';

@Component({
  selector: 'm-channel--carousel',
  inputs: ['_banners: banners', '_editMode: editMode'],
  outputs: ['done_event: done', 'delete_event: delete'],
  template: `
    <i
      class="material-icons left"
      (click)="prev()"
      [hidden]="banners.length <= 1"
      >keyboard_arrow_left</i
    >
    <div *ngFor="let banner of banners; let i = index">
      <minds-banner
        [src]="banner.src"
        [top]="banner.top_offset"
        [overlay]="true"
        [ngClass]="{ 'is-hidden': i != index, 'edit-mode': editing }"
        [editMode]="editing"
        [done]="done"
        (added)="added($event, i)"
      ></minds-banner>

      <div
        class="delete-button"
        (click)="delete(i)"
        [hidden]="i != index || !editing"
        title="Delete image from current banner carousel slide"
      >
        <button
          class="mdl-button mdl-button--raised mdl-button--colored material-icons"
        >
          delete
        </button>
      </div>
    </div>
    <i
      class="material-icons right"
      (click)="next()"
      [hidden]="banners.length <= 1"
      >keyboard_arrow_right</i
    >
  `,
})
export class CarouselComponent {
  banners: Array<any> = [];

  editing: boolean = false;
  src: string = '';
  modified: Array<any> = []; //all banners should be exported to here on the done event, and sent to parent

  done_event = new EventEmitter();
  delete_event = new EventEmitter();
  done: boolean = false; //if set to true, tells the child component to return "added"
  rotate: boolean = true; //if set to true enabled rotation
  rotator$: Subscription;
  interval: number = 3000; //the interval for each banner to stay before rotating
  index: number = 0; //the current visible index of the carousel.

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.run();
  }

  /**
   * A list of banners are sent from the parent, if done are sent a blank one is entered
   */
  set _banners(value: any) {
    if (value) {
      this.banners = value;
    } else {
      this.banners.push({
        src: null,
      });
    }
  }

  /**
   * If the parent set edit mode
   */
  set _editMode(value: boolean) {
    //was in edit more, now settings not in edit more
    if (this.editing && !value) {
      console.log('[carousel]: edit mode ended');
      this._done();
      return;
    }

    this.editing = value;
    if (!this.editing) {
      return;
    }
    console.log('[carousel]: edit mode enabled');
    this.rotate = false;
    this.done = false;
    var blank_banner = false;
    for (var i in this.banners) {
      if (!this.banners[i].src) blank_banner = true;
    }
    if (!blank_banner) {
      this.banners.push({
        src: null,
      });
    }
  }

  /**
   * Fired when the child component adds a new banner
   */
  added(value: any, index) {
    console.log(this.banners[index].guid, value.file);
    if (!this.banners[index].guid && !value.file) return; //this is our 'add new' post

    //detect if we have changed
    var changed = false;
    if (value.top !== this.banners[index].top) changed = false;
    if (value.file) changed = true;

    if (!changed) return;

    if (!this.banners[index].src) {
      this.banners[index].src = value.file;
    }

    this.modified.push({
      guid: this.banners[index].guid,
      index: index,
      file: value.file,
      top: value.top,
    });
  }

  delete(index) {
    this.delete_event.next(this.banners[index]);
    this.banners.splice(index, 1);
    if (this.banners.length === 0) {
      this.banners.push({ src: null });
    }
    this.next();
  }

  /**
   * Once we retreive all the modified banners, we fire back to the parent the new list
   */
  _done() {
    this.editing = false; //this should update each banner (I'd prefer even driven but change detection works..)
    this.done = true;
    console.log('[carousel]: received done event');
    //after one second?
    setTimeout(() => {
      this.done_event.next(this.modified);
      this.modified = [];

      let blank_banner: any = false;
      for (var i in this.banners) {
        if (!this.banners[i].src) blank_banner = i;
      }

      if (blank_banner !== false) {
        this.banners.splice(blank_banner, 1);
        this.next();
      }
    }, 1000);
  }

  prev() {
    var max = this.banners.length - 1;
    if (this.index === 0) this.index = max;
    else this.index--;
    this.run(); //resets the carousel
  }

  next() {
    var max = this.banners.length - 1;
    if (this.index >= max) this.index = 0;
    else this.index++;
    this.run(); //resets the carousel
  }

  run() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.rotator$) this.rotator$.unsubscribe();

    this.rotator$ = interval(this.interval).subscribe(() => {
      if (this.rotate) {
        var max = this.banners.length - 1;
        if (this.index >= max) this.index = 0;
        else this.index++;
      }
    });
  }

  ngOnDestroy() {
    if (this.rotator$) this.rotator$.unsubscribe();
  }
}
