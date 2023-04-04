import { Injectable } from '@angular/core';
import Player from 'video.js/dist/types/player';
import Plugin from 'video.js/dist/types/plugin';
// import videojsContribAds from "videojs-contrib-ads";

/**
 * This class is a currently not in production prototype for preroll ads.
 * When releasing the feature we should extend the actual videojs Plugin class
 * when the latest types are available. This will mean moving logic
 * into the constructor and changing how this class is initialized.
 *
 * Custom types may need to be added for individual plugins such as this one.
 *
 * We may also need to make sure events are firing inappropriately on ads, and that
 * boost views are correctly attributed.
 */
@Injectable({ providedIn: 'root' })
export class VjsAdsPlugin {
  public init(player: Player | any): void {
    // force init - this is intentionally unused. - uncomment below when package is installed.
    // const plugIn: Plugin = videojsContribAds;

    player.ads(); // initialize videojs-contrib-ads

    player.on('readyforpreroll', () => {
      // disable progress control so user cannot skip.
      player.controlBar.progressControl.disable();

      player.ads.startLinearAdMode();

      // play linear ad content
      player.src(
        'https://raw.githubusercontent.com/videojs/videojs-contrib-ads/master/examples/minimal/kitteh.mp4'
      );

      // send event when ad is playing to remove loading spinner
      player.one('adplaying', () => {
        player.trigger('ads-ad-started');
      });

      // resume content when all your linear ads have finished
      player.one('adended', () => {
        // end ad mode.
        player.ads.endLinearAdMode();

        // re-enable progress control so user can skip.
        player.controlBar.progressControl.enable();
      });
    });

    // could fetch ad inventory here.
    player.trigger('adsready');
  }
}
