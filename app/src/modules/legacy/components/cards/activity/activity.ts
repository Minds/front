import { Component, EventEmitter, ElementRef, Input, ViewChild } from '@angular/core';

import { Client } from '../../../../../services/api';
import { SessionFactory } from '../../../../../services/session';
import { ScrollService } from '../../../../../services/ux/scroll';
import { AttachmentService } from '../../../../../services/attachment';
import { TranslationService } from '../../../../../services/translation';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { ChannelBadgesComponent } from '../../../../../common/components/badges/badges.component';
import { BoostCreatorComponent } from '../../../../boost/creator/creator.component';
import { WireCreatorComponent } from '../../../../wire/creator/creator.component';
import { MindsVideo } from '../../../../video/video';

@Component({
  moduleId: module.id,
  selector: 'minds-activity',
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  inputs: ['object', 'commentsToggle', 'visible', 'canDelete'],
  outputs: ['_delete: delete', 'commentsOpened', 'onViewed'],
  templateUrl: 'activity.html'
})

export class Activity {

  minds = window.Minds;

  activity: any;
  commentsToggle: boolean = false;
  shareToggle: boolean = false;
  deleteToggle: boolean = false;
  translateToggle: boolean = false;
  translateEvent: EventEmitter<any> = new EventEmitter();
  session = SessionFactory.build();
  showBoostOptions: boolean = false;
  @Input() boost: boolean = false;
  type: string;
  element: any;
  visible: boolean = false;

  editing: boolean = false;
  @Input() hideTabs: boolean;

  _delete: EventEmitter<any> = new EventEmitter();
  commentsOpened: EventEmitter<any> = new EventEmitter();
  scroll_listener;

  childEventsEmitter: EventEmitter<any> = new EventEmitter();
  onViewed: EventEmitter<any> = new EventEmitter<any>();

  isTranslatable: boolean;
  canDelete: boolean = false;

  menuOptions: Array<string> = ['edit', 'translate', 'share', 'mute', 'feature', 'delete', 'report', 'set-explicit', 'block'];

  @ViewChild('player') player: MindsVideo;

  constructor(
    public client: Client,
    public scroll: ScrollService,
    _element: ElementRef,
    public attachment: AttachmentService,
    public translationService: TranslationService,
    private overlayModal: OverlayModalService
  ) {

    this.element = _element.nativeElement;
    this.isVisible();
  }

  set object(value: any) {
    if (!value)
      return;
    this.activity = value;
    this.activity.url = window.Minds.site_url + 'newsfeed/' + value.guid;

    if (!this.activity.message) {
      this.activity.message = '';
    }

    if (!this.activity.title) {
      this.activity.title = '';
    }

    this.isTranslatable = (
      this.translationService.isTranslatable(this.activity) ||
      (this.activity.remind_object && this.translationService.isTranslatable(this.activity.remind_object))
    );
  }

  @Input() set boostToggle(toggle: boolean) {
    //if(toggle)
    //  this.showBoost();
    return;
  }

  save() {
    console.log('trying to save your changes to the server', this.activity);
    this.editing = false;
    this.activity.edited = true;
    this.client.post('api/v1/newsfeed/' + this.activity.guid, this.activity);
  }

  delete($event: any = {}) {
    if ($event.inProgress) {
      $event.inProgress.emit(true);
    }
    this.client.delete(`api/v1/newsfeed/${this.activity.guid}`)
      .then((response: any) => {
        if ($event.inProgress) {
          $event.inProgress.emit(false);
          $event.completed.emit(0);
        }
        this._delete.next(this.activity);
      })
      .catch(e => {
        if ($event.inProgress) {
          $event.inProgress.emit(false);
          $event.completed.emit(1);
        }
      });
  }

  /*async setSpam(value: boolean) {
    this.activity['spam'] = value;

    try {
      if (value) {
        await this.client.put(`api/v1/admin/spam/${this.activity.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/spam/${this.activity.guid}`);
      }
    } catch (e) {
      this.activity['spam'] = !value;
    }
  }

  async setDeleted(value: boolean) {
    this.activity['deleted'] = value;

    try {
      if (value) {
        await this.client.put(`api/v1/admin/delete/${this.activity.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/delete/${this.activity.guid}`);
      }
    } catch (e) {
      this.activity['delete'] = !value;
    }
  }*/

  openComments() {
    this.commentsToggle = !this.commentsToggle;
    this.commentsOpened.emit(this.commentsToggle);
  }

  togglePin(){
    
    if(this.session.getLoggedInUser().guid != this.activity.owner_guid){
      return;
    }

    let action = 'pin';
    if(this.activity.pinned){
      action = 'unpin';
    }
    this.activity.pinned = !this.activity.pinned;
    this.client.post(`api/v1/newsfeed/${action}/${this.activity.guid}`)
      .catch((response: any) => {
        this.activity.pinned = !this.activity.pinned;
      });
  }

  showBoost() {
    const boostModal = this.overlayModal.create(BoostCreatorComponent, this.activity);

    boostModal.onDidDismiss(() => {
      this.showBoostOptions = false;
    });

    boostModal.present();
  }

  showWire() {
    if(this.session.getLoggedInUser().guid !== this.activity.owner_guid) {
      this.overlayModal.create(WireCreatorComponent,
        this.activity.remind_object ? this.activity.remind_object : this.activity)
          .present();
    }
  }

  menuOptionSelected(option: string) {
    switch (option) {
      case 'edit':
        this.editing = true;
        break;
      case 'delete':
        this.delete();
        break;
      case 'set-explicit':
        this.setExplicit(true);
        break;
      case 'remove-explicit':
        this.setExplicit(false);
        break;
      case 'translate':
        this.translateToggle = true;
        break;
    }
  }

  setExplicit(value: boolean) {
    let oldValue = this.activity.mature,
      oldMatureVisibility = this.activity.mature_visibility;

    this.activity.mature = value;
    this.activity.mature_visibility = void 0;

    if (this.activity.custom_data && this.activity.custom_data[0]) {
      this.activity.custom_data[0].mature = value;
    } else if (this.activity.custom_data) {
      this.activity.custom_data.mature = value;
    }

    this.client.post(`api/v1/entities/explicit/${this.activity.guid}`, { value: value ? '1' : '0' })
      .catch(e => {
        this.activity.mature = oldValue;
        this.activity.mature_visibility = oldMatureVisibility;

        if (this.activity.custom_data && this.activity.custom_data[0]) {
          this.activity.custom_data[0].mature = oldValue;
        } else if (this.activity.custom_data) {
          this.activity.custom_data.mature = oldValue;
        }
      });
  }

  isVisible() {
    if (this.visible) {
      this.onViewed.emit(this.activity);
      return true;
    }
    this.scroll_listener = this.scroll.listenForView().subscribe((view) => {
      if (this.element.offsetTop - this.scroll.view.clientHeight <= this.scroll.view.scrollTop && !this.visible) {
        //stop listening
        this.scroll.unListen(this.scroll_listener);
        //make visible
        this.visible = true;

        if (this.boost) {
          this.onViewed.emit(this.activity);
        } else {
          //update the analytics
          this.client.put('api/v1/newsfeed/' + this.activity.guid + '/view');
        }
      }
    });
    //this.scroll.fire();
  }

  ngOnDestroy() {
    this.scroll.unListen(this.scroll_listener);
  }

  propagateTranslation($event) {
    if (this.activity.remind_object && this.translationService.isTranslatable(this.activity.remind_object)) {
      this.childEventsEmitter.emit({
        action: 'translate',
        args: [$event]
      });
    }
  }

  hide() {
    if (this.player) {
      console.warn('player: ', this.player);
      this.player.pause();
    }
  }
}
