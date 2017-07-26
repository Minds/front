import { Component, EventEmitter, ElementRef, Input} from '@angular/core';

import { Client } from '../../../../../services/api';
import { SessionFactory } from '../../../../../services/session';
import { ScrollService } from '../../../../../services/ux/scroll';
import { AttachmentService } from '../../../../../services/attachment';
import { TranslationService } from '../../../../../services/translation';
import { OverlayModalService } from "../../../../../services/ux/overlay-modal";

import { BoostCreatorComponent } from "../../../../boost/creator/creator.component";

@Component({
  moduleId: module.id,
  selector: 'minds-activity',
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  inputs: ['object', 'commentsToggle', 'visible', 'canDelete'],
  outputs: [ '_delete: delete', 'commentsOpened'],
  templateUrl: 'activity.html'
})

export class Activity {

  minds = window.Minds;

  activity : any;
  menuToggle : boolean = false;
  commentsToggle : boolean = false;
  shareToggle : boolean = false;
  reportToggle: boolean = false;
  deleteToggle: boolean = false;
  translateToggle: boolean = false;
  translateEvent: EventEmitter<any> = new EventEmitter();
  session = SessionFactory.build();
  showBoostOptions : boolean = false;
  type : string;
  element : any;
  visible : boolean = false;

  editing : boolean = false;
  hideTabs: boolean;

  _delete: EventEmitter<any> = new EventEmitter();
  commentsOpened: EventEmitter<any> = new EventEmitter();
  scroll_listener;

  asyncMute: boolean = false;
  asyncMuteInProgress: boolean = false;

  childEventsEmitter: EventEmitter<any> = new EventEmitter();

  isTranslatable: boolean;
  canDelete : boolean = false;

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
    if(!value)
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
  }

  save(){
    console.log('trying to save your changes to the server', this.activity);
    this.editing = false;
    this.activity.edited = true;
    this.client.post('api/v1/newsfeed/' + this.activity.guid, this.activity)
      .then((response : any) => {

      });
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

  mute() {
    this.activity['is:muted'] = true;

    this.client.post(`api/v1/entities/notifications/${this.activity.guid}/mute`)
    .then((response: any) => {
      if (response.done) {
        this.activity['is:muted'] = true;
        return;
      }

      throw new Error('E_NOT_DONE');
    })
    .catch(e => {
      this.activity['is:muted'] = false;
    });
  }

  unmute() {
    this.activity['is:muted'] = false;

    this.client.post(`api/v1/entities/notifications/${this.activity.guid}/unmute`)
    .then((response: any) => {
      if (response.done) {
        this.activity['is:muted'] = false;
        return;
      }

      throw new Error('E_NOT_DONE');
    })
    .catch(e => {
      this.activity['is:muted'] = true;
    });
  }

  cardMenuHandler(opened: boolean) {
    this.asyncMuteFetch();
  }

  asyncMuteFetch() {
    if (this.asyncMute || this.asyncMuteInProgress) {
      return;
    }

    this.asyncMuteInProgress = true;

    this.client.get(`api/v1/entities/notifications/${this.activity.guid}`)
    .then((response: any) => {
      this.asyncMuteInProgress = false;
      this.asyncMute = true;

      this.activity['is:muted'] = !!response['is:muted'];
    })
    .catch(e => {
      this.asyncMuteInProgress = false;
    });
  }

  openComments(){
    this.commentsToggle = !this.commentsToggle;
    this.commentsOpened.emit(this.commentsToggle);
  }

  showBoost(){
    const boostModal = this.overlayModal.create(BoostCreatorComponent, this.activity);

    boostModal.onDidDismiss(() => {
      this.showBoostOptions = false;
    });

    boostModal.present();
  }

  feature(){
    this.activity.featured = true;
    this.client.put('api/v1/admin/feature/' + this.activity.guid)
      .catch(() => {
        this.activity.featured = false;
      });
  }

  unFeature(){
    this.activity.featured = false;
    this.client.delete('api/v1/admin/feature/' + this.activity.guid)
      .catch(() => {
        this.activity.featured = true;
      });
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

    this.client.post(`api/v1/admin/activity/${this.activity.guid}/mature`, { value: value ? '1' : '0' })
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

  isVisible(){
    if(this.visible){
      return true;
    }
    this.scroll_listener = this.scroll.listenForView().subscribe((view) => {
      if(this.element.offsetTop - this.scroll.view.clientHeight <= this.scroll.view.scrollTop && !this.visible){
        //stop listening
        this.scroll.unListen(this.scroll_listener);
        //make visible
        this.visible = true;
        //update the analytics
        this.client.put('api/v1/newsfeed/' + this.activity.guid + '/view');
        }
    });
    //this.scroll.fire();
  }

  ngOnDestroy(){
    this.scroll.unListen(this.scroll_listener);
  }

  propagateTranslation($event) {
    if (this.activity.remind_object && this.translationService.isTranslatable(this.activity.remind_object)) {
      this.childEventsEmitter.emit({
        action: 'translate',
        args: [ $event ]
      });
    }
  }
}
