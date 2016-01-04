import { Component, View, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

declare var tinymce;

@Component({
  selector: 'minds-tinymce',
  properties: [ '_content: content', 'reset' ],
  events: [ 'update: contentChange' ]
})
@View({
  template: `
    <textarea>{{content}}</textarea>
  `,
  directives: [ CORE_DIRECTIVES ]
})

export class MindsTinymce {

  editor : any;
  ready : boolean = false;
  content = "";
  update = new EventEmitter();
  timeout;

  constructor() {
    this.init();
  }

  init(){
    var self = this;
    tinymce.init({
      selector:'minds-tinymce > textarea',
      format: 'raw',
      menubar: false,
      toolbar: "styleselect | bold italic underline textcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image media | code",
      statusbar: false,
      plugins: [
	         "advlist autolink link image lists preview hr anchor pagebreak",
	         "media nonbreaking code",
	         "table directionality autoresize"
	    ],
      setup: (ed) => {

        this.editor = ed;

        ed.on('change', (e) => {
          this.ready = true;
          this.content = ed.getContent();
          this.update.next(ed.getContent());
        })

        ed.on('keyup', (e) => {
          this.ready = true;
          this.content = ed.getContent();
          this.update.next(ed.getContent());
        })

      }
    });
  }

  ngOnDestroy(){
    this.editor.setContent("");
    if(tinymce)
      tinymce.remove('minds-tinymce > textarea');
    this.content = "";
    this.ready = false;
  }

  set _content(value : string){
    this.content = value;
    new Promise((resolve, reject) => {
      if(this.editor)
        resolve(value);
    })
    .then((value : string) => {
      if(!this.ready && value && value != this.editor.getContent()){
        this.ready = true;
        this.editor.setContent(value);
      }
    });
  }

  set reset(value : boolean){
    if(value && this.editor.getContent()){
      this.editor.setContent(this.content);
      this.ready = false;
    }
  }

}
