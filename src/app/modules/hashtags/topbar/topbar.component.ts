import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Client } from '../../../services/api/client';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { HashtagsSelectorModalComponent } from '../hashtag-selector-modal/hashtags-selector.component';

type Hashtag = {
  value: string, selected: boolean
};

@Component({
  selector: 'm-topbar--hashtags',
  templateUrl: 'topbar.component.html'
})
export class TopbarHashtagsComponent implements OnInit {
  hashtags: Hashtag[] = [];
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public client: Client,
    public overlayModal: OverlayModalService) {

  }

  ngOnInit() {
    this.getSuggestedHashtags();
  }

  async getSuggestedHashtags() {
    try {
      const response: any = await this.client.get('api/v2/hashtags/suggested?limit=5');
      this.hashtags = response.tags.slice(0, Math.min(5, response.tags.length));
    } catch (e) {
      console.error(e);
    }
  }

  async toggleHashtag(hashtag: Hashtag) {
    hashtag.selected = !hashtag.selected;
    const endpoint = `api/v2/hashtags/user/${hashtag.value}`;

    try {
      if (hashtag.selected) {
        await this.client.post(endpoint);
      } else {
        await this.client.delete(endpoint);
      }

      this.selectionChange.emit();
    } catch (e) {
      console.error(e);
    }
  }

  openModal() {
    this.overlayModal.create(HashtagsSelectorModalComponent, {}, {
      class: 'm-overlay-modal--hashtag-selector m-overlay-modal--medium-large'
    })
      .onDidDismiss(()=>{this.selectionChange.emit()})
      .present();
  }
}