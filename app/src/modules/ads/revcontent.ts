import { Component, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'revcontent',
  template: `
    <!-- ads will load into here -->
  `,
  host: {
    'class': 'm-ad-block m-ad-block-revcontent'
  }
})

export class RevContent {

  visible: boolean = false;
  _element: any;

  constructor(element: ElementRef) {
    this._element = element.nativeElement;
    RevContentService.load(this._element).then(() => {
      this.visible = true;
    });
  }

  ngOnDestroy() {
    RevContentService.unload(this._element);
  }

}

class RevContentService {

  static script;

  static load(element: any) {
    return new Promise((resolve) => {
      if (!RevContentService.script) {
        RevContentService.script = document.createElement('script');
        RevContentService.script.id = 'rc_' + Math.floor(Math.random() * 1000);
        RevContentService.script.type = 'text/javascript';
        RevContentService.script.src = 'https://trends.revcontent.com/serve.js.php?w=11364&t='
          + RevContentService.script.id
          + '&c=' + (new Date()).getTime()
          + '&width=' + (window.outerWidth || document.documentElement.clientWidth);
        RevContentService.script.async = true;
        //var rcds = document.getElementById("rcjsload_7c87b6");
        element.appendChild(RevContentService.script);
        resolve(true);
      } else {
        resolve(true);
      }
    });
  }

  static unload(element: any) {
    element.innerHTML = '';
    if (RevContentService.script) {
      RevContentService.script.remove();
      RevContentService.script = null;
    }
  }
}
