import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import { Router, RouteParams, Location, ROUTER_DIRECTIVES } from 'angular2/router';
import { Client, Upload } from 'src/services/api';
import { Material } from 'src/directives/material';
import { MindsTinymce } from 'src/components/editors/tinymce';

@Component({
  selector: 'minds-admin-pages',
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'src/controllers/admin/pages/pages.html',
  directives: [ CORE_DIRECTIVES, Material, FORM_DIRECTIVES, ROUTER_DIRECTIVES, MindsTinymce ]
})

export class AdminPages {

  pages : Array<any> = [];
  page : any = {
      title : 'New Page',
      body: '',
      path: '',
      menuContainer: 'footer'
  };
  path : string = "";

  constructor(public client: Client, public params : RouteParams){
    this.path = params.params['path'];
    this.load();
  }

  load(){
    this.client.get('api/v1/admin/pages')
      .then((response : any) => {
        this.pages = response.pages;
      });
  }

  save(page){
    this.client.post('api/v1/admin/pages', {
        title: page.title,
        body: page.body,
        path: page.path,
        menuContainer: page.menuContainer
      })
      .then((response : any) => {

      });
  }

  delete(page){
    this.newPage();
    this.client.delete('api/v1/admin/pages/' + page.path);
    for(var i in this.pages){
      if(page.path == this.pages[i].path)
        this.pages.splice(i, 1);
    }
  }

  setPage(page){
      this.page = page;
  }

  newPage(){
    this.page = {
        title: 'New Page',
        body: '',
        path: 'new',
        menuContainer: 'footer'
    }
    this.pages.push(this.page);
  }

}
