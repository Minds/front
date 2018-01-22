import { Directive, Input } from '@angular/core';

import { VideoAdsService } from './ads.service';

@Directive({
  selector: '[videoAds]'
})
export class VideoAdsDirective {

  @Input() autoplay: boolean = true;
  @Input() muted: boolean = false;

  service: VideoAdsService = new VideoAdsService();

  ngOnInit() {
    if (this.autoplay && !this.muted) {
      //load the service
    }
  }

}
