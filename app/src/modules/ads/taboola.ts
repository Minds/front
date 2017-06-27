import { Component, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'taboola',
  template: `
    <!-- ads will load into here -->
    <div [id]="id"></div>
  `,
  host: {
    'class': 'm-ad-block m-ad-block-taboola'
  }
})

export class Taboola{

  visible : boolean = false;
  _element : any;
  id : string = 'taboola-below-article-thumbnails';

  constructor(element : ElementRef) {
    this._element = element.nativeElement;
    this.id = 'taboola-below-article-thumbnails-' + Date.now();
    TaboolaService.load(this._element, this.id).then(() => {
      this.visible = true;
    });
  }

  ngOnDestroy(){
    TaboolaService.unload(this._element);
  }

}

class TaboolaService{

  static loaded : boolean;

  static load(element : any, id : string){
    return new Promise((resolve) => {
      if(!TaboolaService.loaded){
        (<any>window)._taboola = (<any>window)._taboola || [];
        (<any>window)._taboola.push({article:'auto'});
        !function (e, f, u, i) {
          if (!document.getElementById(i)){
             e.async = true;
             e.src = u;
             e.id = i;
             f.parentNode.insertBefore(e, f);
           }
         }(document.createElement('script'),
         document.getElementsByTagName('script')[0],
         '//cdn.taboola.com/libtrc/minds/loader.js',
         'tb_loader_script');
         TaboolaService.loaded = true;
       }
       (<any>window)._taboola = (<any>window)._taboola || [];
       (<any>window)._taboola.push({
         mode: 'thumbnails-d',
         container: id,
         placement: 'Below Article Thumbnails',
         target_type: 'mix'
         });
       //(<any>window)._taboola.push({article:'auto', url: window.location.href});
           //(<any>window)._taboola.push({notify:'newPageLoad'});
               //(<any>window)._taboola.push({flush: true});
       resolve(true);
    });
  }

  static unload(element : any){
  //element.innerHTML = '';
  }
}
