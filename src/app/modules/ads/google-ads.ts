import { Component, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'google-ad',
  inputs: ['type', 'location'],
  template: `
    <ins
       *ngIf="type == 'square'"
       class="adsbygoogle"
       style="display:block;width:336px;height:280px;margin: auto; padding: 8px; background: #EEE;"
       data-ad-client="ca-pub-9303771378013875"
       data-ad-slot="5788264423"></ins>
   <ins
       *ngIf="type == 'responsive'"
       class="adsbygoogle"
        style="display:block; width:100%;"
        data-ad-client="ca-pub-9303771378013875"
        data-ad-slot="7588308825"
        data-ad-format="auto"
        ></ins>
    <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  `,
  host: {
    '[class]': '\'m-ad-block m-ad-block-google \' + type + \' m-ad-block-\' + location'
  }
})

export class GoogleAds {

  visible: boolean = false;
  type: string = 'square';
  location: string = 'default';

  constructor(element: ElementRef) {
    GoogleAdsService.load().then(() => {
      this.visible = true;
      console.log('ads ready to show');
    });
  }

  ngOnDestroy() {
    GoogleAdsService.unload();
  }

}

class GoogleAdsService {

  static script;

  static load() {
    return new Promise((resolve) => {
      if (!GoogleAdsService.script) {
        GoogleAdsService.script = document.createElement('script');
        GoogleAdsService.script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        GoogleAdsService.script.async = true;
        document.body.appendChild(GoogleAdsService.script);
        resolve(true);
      } else {
        resolve(true);
      }
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }

  static unload() {
    if (GoogleAdsService.script) {
      GoogleAdsService.script.remove();
      GoogleAdsService.script = null;
    }
  }
}
