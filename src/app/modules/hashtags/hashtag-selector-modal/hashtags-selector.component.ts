import { ChangeDetectorRef, Component } from '@angular/core';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';


@Component({
  moduleId: module.id,
  selector: 'm-hastags-selector-modal',
  templateUrl: 'hashtags-selector.component.html'
})
export class HashtagsSelectorModalComponent {

  minds = window.Minds;
  inProgress: boolean = false;
  hashtags: Array<any> = [];
  error: string = '';

  constructor(
    public session: Session,
    private cd: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
  ) { }

  ngOnInit() {
    this.load();
  }

  close() {
    this.overlayModal.dismiss();
  }

  load() {
    this.inProgress = true;
    return this.client.get(`api/v2/hashtags/suggested`)
      .then((result: any) => {
        this.inProgress = false;
        this.hashtags = result.tags.sort(function (a, b) {
          if (a.selected && !b.selected) {
            return -1;
          }
          if (!a.selected && b.selected) {
            return 1;
          }
          return 0;
        });
      })
      .catch(e => {
        this.inProgress = false;
      });

  }

  async toggleSelection(hashtag) {
    this.inProgress = true;
    try {
      hashtag.selected = !hashtag.selected;
      if (!hashtag.selected) {
        await this.client.delete(`api/v2/hashtags/user/${hashtag.value}`);
      } else {
        await this.client.post(`api/v2/hashtags/user/${hashtag.value}`);
      }
    } catch (e) {
      this.error = (e && e.message) || 'Sorry, something went wrong';
      hashtag.selected = !hashtag.selected;
    }

    this.inProgress = false;
  }
}
