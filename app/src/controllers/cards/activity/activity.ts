import { Component, View, EventEmitter, ElementRef} from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { Material } from '../../../directives/material';
import { AutoGrow } from '../../../directives/autogrow';
import { Remind } from '../remind/remind';
import { BUTTON_COMPONENTS } from '../../../components/buttons';
import { MindsVideo } from '../../../components/video';
import { Boost } from '../../boosts/boost/boost';
import { Comments } from '../../comments/comments';
import { MINDS_PIPES } from '../../../pipes/pipes';
import { TagsLinks } from '../../../directives/tags';
import { ScrollFactory } from '../../../services/ux/scroll';
import { ShareModal } from '../../../components/modal/modal';


@Component({
  selector: 'minds-activity',
  viewProviders: [ Client ],
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  inputs: ['object', 'commentsToggle', 'showBoostOptions: boostToggle'],
  outputs: [ '_delete: delete']
})
@View({
  templateUrl: 'src/controllers/cards/activity/activity.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, BUTTON_COMPONENTS, Boost, Comments, Material, AutoGrow, Remind, RouterLink, TagsLinks, MindsVideo, ShareModal ],
  pipes: [ MINDS_PIPES ]
})

export class Activity {

  activity : any;
  menuToggle : boolean = false;
  commentsToggle : boolean = false;
  shareToggle : boolean = false;
  session = SessionFactory.build();
  scroll = ScrollFactory.build();
  showBoostOptions : boolean = false;
  type : string;
  element : any;
  visible : boolean = false;

  editing : boolean = false;

  _delete: EventEmitter<any> = new EventEmitter();
  scroll_listener;

	constructor(public client: Client, _element: ElementRef){
    this.element = _element.nativeElement;
    this.isVisible();
	}

  set object(value: any) {
    if(!value)
      return;
    this.activity = value;
    this.activity.url = window.Minds.site_url + 'newsfeed/' + value.guid;
  }

  save(){
    console.log('trying to save your changes to the server', this.activity);
    this.editing = false;
    this.client.post('api/v1/newsfeed/' + this.activity.guid, this.activity)
      .then((response : any) => {

      });
  }

  delete(){
    this.client.delete('api/v1/newsfeed/'+this.activity.guid);
    this._delete.next(true);
  }

  openMenu(){
    this.menuToggle = !this.menuToggle;
    console.log(this.menuToggle);
  }

  openComments(){
    this.commentsToggle = !this.commentsToggle;
  }

  showBoost(){
      this.showBoostOptions = !this.showBoostOptions;
  }

  isVisible(){
    this.scroll_listener = this.scroll.listen((view) => {
      if(this.element.offsetTop - view.height <= view.top && !this.visible){
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
}
