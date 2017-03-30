import { Title } from '@angular/platform-browser';

export class MindsTitle {

  private sep = ' | ';
  private default_title = 'Minds';

  constructor(public title: Title) { }

  setTitle(value : string){
    if (value){
      this.title.setTitle([value, this.default_title].join(this.sep));
    }
    else this.title.setTitle(this.default_title);
  }

  static _(title: Title) {
    return new MindsTitle(title);
  }
}
