import { ChangeDetectorRef, Component } from '@angular/core';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Session } from '../../../services/session';
import { TopbarHashtagsService } from '../service/topbar.service';

type Hashtag = {
  value: string, selected: boolean
};

@Component({
  moduleId: module.id,
  selector: 'm-hastags-selector-modal',
  templateUrl: 'hashtags-selector.component.html'
})
export class HashtagsSelectorModalComponent {

  minds = window.Minds;
  inProgress: boolean = false;
  hashtags: Array<Hashtag> = [];
  error: string = '';
  input: string = '';
  addingHashtag: boolean = false;

  _opts: any;
  set opts(opts: any) {
    this._opts = opts;
  }

  constructor(
    public session: Session,
    private cd: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private service: TopbarHashtagsService,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  close() {
    this.overlayModal.dismiss();
  }

  async load() {
    this.inProgress = true;

    try {
      this.hashtags = await this.service.load(50);
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
  }

  keyUp(e) {
    switch (e.keyCode) {
      case 32: //space
      case 9: //tab
      case 13: //enter
      case 188: //comma
        this.addNew();
        break;
    }
  }

  async addNew() {
    this.addingHashtag = true;
    let hashtag: Hashtag = {
      value: this.service.cleanupHashtag(this.input.toLowerCase()),
      selected: false,
    };
    this.hashtags.push(hashtag);
    await this.toggleSelection(hashtag);
    this.input = ''; // clear input
    this.addingHashtag = false;
  }

  async toggleSelection(hashtag) {
    try {
      await this.service.toggleSelection(hashtag, this);
    } catch (e) {
      this.error = (e && e.message) || 'Sorry, something went wrong';
      hashtag.selected = !hashtag.selected;
    }

    if (this._opts && this._opts.onSelected) {
      this._opts.onSelected();
    }

  }
}
