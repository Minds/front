import { Component, EventEmitter } from '@angular/core';
import { EmbedService } from '../../../services/embed.service';
import { SiteService } from '../../services/site.service';

/**
 * Social media icons that allow users to easily share links to blogs and single activity pages.
 * Can be enabled/disabled in user settings.
 */
@Component({
  selector: 'm-social-icons',
  inputs: ['_url: url', '_title: title', '_embed: embed'],
  templateUrl: 'social-icons.html',
  styleUrls: ['./social-icons.ng.scss'],
})
export class SocialIcons {
  url: string = '';
  title: string = `Shared via ${this.site.title}`;
  encodedUrl: string = '';

  embedCode: string = '';
  embedModalOpen: boolean = false;
  embedModalClosed: EventEmitter<any> = new EventEmitter();

  constructor(
    public embed: EmbedService,
    private site: SiteService
  ) {}

  set _url(value: string) {
    this.url = value;
    this.encodedUrl = encodeURI(this.url);
  }

  set _title(value: string) {
    this.title = value;
  }

  set _embed(object: any) {
    this.embedCode = this.embed.getIframeFromObject(object);
  }

  get encodedTitle() {
    return encodeURI(this.title);
  }

  copy(e) {
    e.target.select();
    document.execCommand('copy');
  }

  openWindow(url: string) {
    window.open(url, '_blank', 'width=600, height=300, left=80, top=80');
  }

  embedModalClose() {
    this.embedModalOpen = false;
    this.embedModalClosed.next(true);
  }
}
