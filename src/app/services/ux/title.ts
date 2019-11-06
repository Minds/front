import { Title } from '@angular/platform-browser';
import { SiteService } from '../../common/services/site.service';

export class MindsTitle {
  private counter: number;
  private sep = ' | ';
  private default_title = 'Minds';
  private text: string = '';

  static _(title: Title, site: SiteService) {
    return new MindsTitle(title, site);
  }

  constructor(public title: Title, protected site: SiteService) {
    if (this.site.isProDomain) {
      this.default_title = this.site.title + ' - ' + this.site.oneLineHeadline;
    }
  }

  setTitle(value: string, join = true) {
    let title;

    if (value && join) {
      title = [value, this.default_title]
        .filter(fragment => Boolean(fragment))
        .join(this.sep);
    } else if (value) {
      title = value;
    } else {
      title = this.default_title;
    }
    this.text = title;
    this.applyTitle();
  }

  setCounter(value: number) {
    this.counter = value;
    this.applyTitle();
  }

  applyTitle() {
    if (this.counter) {
      this.title.setTitle(`(*) ${this.text}`);
    } else {
      this.title.setTitle(this.text);
    }
  }
}
