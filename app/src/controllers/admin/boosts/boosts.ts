import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import { Router, RouteParams, Location, ROUTER_DIRECTIVES } from 'angular2/router';
import { Client, Upload } from '../../../services/api';
import { CARDS } from '../../../controllers/cards/cards';
import { MINDS_GRAPHS } from '../../../components/graphs';
import { Material } from '../../../directives/material';

@Component({
  selector: 'minds-admin-boosts',
  viewBindings: [ Client ],
  host: {
    '(keydown)': 'onKeyDown($event)'
  }
})
@View({
  templateUrl: 'src/controllers/admin/boosts/boosts.html',
  directives: [ CORE_DIRECTIVES, Material, FORM_DIRECTIVES, ROUTER_DIRECTIVES, MINDS_GRAPHS, CARDS ]
})

export class AdminBoosts {

  boosts : Array<any> = [];
  type : string = "newsfeed";
  count : number = 0;
  newsfeed_count : number = 0;
  suggested_count : number = 0;

  inProgress : boolean = false;
  moreData : boolean = true;
  offset : string = "";

  constructor(public client: Client, public params : RouteParams){
    if(params.params['type'])
      this.type = params.params['type'];
    else
      this.type = "newsfeed";
    this.load();
    this.domHack();
  }

  load(){
    if(this.inProgress)
      return;
    this.inProgress = true;

    this.client.get('api/v1/admin/boosts/' + this.type, { limit: 24, offset: this.offset })
      .then((response : any) => {
        if(!response.boosts){
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.boosts = this.boosts.concat(response.boosts);
        this.count = response.count;
        this.newsfeed_count = response.newsfeed_count;
        this.suggested_count = response.suggested_count;

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  domHack(){
    var self = this;
    document.addEventListener('keydown', self.onKeypress);
  }

  accept(boost : any = null){
    if(!boost)
      boost = this.boosts[0];

    this.client.post('api/v1/admin/boosts/' + this.type + '/' + boost.guid  + '/accept')
      .then((response : any) => {

      })
      .catch((e) => {

      });
    this.pop(boost);
  }

  reject(boost : any = null){
    if(!boost)
      boost = this.boosts[0];

    this.client.post('api/v1/admin/boosts/' + this.type + '/' + boost.guid  + '/reject')
      .then((response : any) => {

      })
      .catch((e) => {

      });
    this.pop(boost);
  }

  /**
   * Remove an entity from the list
   */
  pop(boost){
    for(var i in this.boosts){
      if(boost == this.boosts[i])
        this.boosts.splice(i,1);
    }
    if(this.type == "newsfeed")
      this.newsfeed_count--;
    else if(this.type == "suggested")
      this.suggested_count--;
    if(this.boosts.length < 5)
      this.load();
  }

  onKeyDown(e){
    //e.preventDefault();
    e.stopPropagation()
    if(e.keyCode == 37)
      return this.accept();
    if(e.keyCode == 39)
      return this.reject();
  }

  /**
   * Hack to make host keypress listen
   */
  onKeypress(e){
    var event = new KeyboardEvent('keydown', e);
    document.getElementsByTagName('minds-admin-boosts')[0].dispatchEvent(event);
  }

  ngOnDestroy(){
    document.removeEventListener('keydown', this.onKeypress);
  }

}
