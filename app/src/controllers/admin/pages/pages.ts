import { Component } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, Location, ROUTER_DIRECTIVES } from 'angular2/router';

import { Client, Upload } from '../../../services/api';
import { Material } from '../../../directives/material';
import { MindsTinymce } from '../../../components/editors/tinymce';
import { MindsBanner } from '../../../components/banner';


@Component({
  selector: 'minds-admin-pages',
  templateUrl: 'src/controllers/admin/pages/pages.html',
  directives: [ CORE_DIRECTIVES, Material, FORM_DIRECTIVES, ROUTER_DIRECTIVES, MindsBanner, MindsTinymce ]
})

export class AdminPages {

  pages : Array<any> = [];
  page : any = {
      title : 'New Page',
      body: '',
      path: '',
      menuContainer: 'footer',
      header: false,
      headerTop: 0,
      subtype: 'page'
  };
  path : string = "";
  status : string = "saved";
  headerFile : File;

  constructor(public client: Client, public upload : Upload, public params : RouteParams){
    this.path = params.params['path'];
    this.load();
  }

  load(){
    this.client.get('api/v1/admin/pages')
      .then((response : any) => {
        this.pages = response.pages;
      });
  }

  save(page, allowHeaderUpload = true){
    this.status = 'saving';
    this.client.post('api/v1/admin/pages', {
        title: page.title,
        body: page.body,
        path: page.path,
        menuContainer: page.menuContainer,
        subtype: page.subtype
      })
      .then((response : any) => {
        if (allowHeaderUpload) {
          this.uploadHeader(page);
        }
        this.status = 'saved';
      });
  }

  delete(page){
    if (!confirm(`Are you sure you want to delete ${page.path}? This action cannot be undone.`)) {
      return;
    }

    if (page.subtype === 'link') {
      this.newLink();
    } else {
      this.newPage();
    }
    this.client.delete(`api/v1/admin/pages/?path=${page.path}`);
    for(var i in this.pages){
      if(page.path == this.pages[i].path) {
        this.pages.splice(i, 1);
        break;
      }
    }
  }

  setPage(page){
      this.page = page;
  }

  setHeader(banner : any){
    this.headerFile = banner.file;
    this.page.header = true;
    this.page.headerTop = banner.top;
  }

  uploadHeader(page){
    this.upload.post('api/v1/admin/pages/' + page.path + '/header', [this.headerFile], {
      headerTop: page.headerTop,
      path: page.path
    });
  }

  newPage(){
    this.page = {
        title: 'New Page',
        body: '',
        path: 'new',
        menuContainer: 'footer',
        header: false,
        headerTop: 0,
        subtype: 'page'
    }
    this.pages.push(this.page);
  }

  newLink(){
    this.page = {
        title: 'New Link',
        body: '',
        path: 'http://',
        menuContainer: 'footer',
        header: false,
        headerTop: 0,
        subtype: 'link'
    }
    this.pages.push(this.page);
  }

}
