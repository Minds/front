import { Component, Input, ElementRef } from '@angular/core';

import { VideoAdsService } from './ads.service';

@Component({
  selector: 'video-ads',
  template: `
  `
})
export class VideoAds {

  service: VideoAdsService = new VideoAdsService();

  @Input() player;
  adContainer;
  adLoader;
  adManager;
  initialized: boolean = false;

  google = window.google;

  constructor(private element: ElementRef) {

  }

  ngOnInit() {
    //this.setupIMA();
    this.element.nativeElement.style.display = 'none';
  }

  setupIMA() {
    this.adContainer = new this.google.ima.AdDisplayContainer(
      this.element.nativeElement, this.player.element);

    this.adLoader = new this.google.ima.AdsLoader(this.adContainer);

    // Listen and respond to ads loaded and error events.
    this.adLoader.addEventListener(
      this.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this.onLoaded.bind(this),
      false);
    this.adLoader.addEventListener(
      this.google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onError.bind(this),
      false);

    // Request video ads.
    var adsRequest = new this.google.ima.AdsRequest();

    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads? '
      + 'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&'
      + 'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&'
      + 'cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=';

    adsRequest.linearAdSlotWidth = this.player.element.clientWidth;
    adsRequest.linearAdSlotHeight = this.player.element.clientHeight;
    adsRequest.nonLinearAdSlotWidth = this.player.element.clientWidth;
    adsRequest.nonLinearAdSlotHeight = 150;
    adsRequest.setAdWillAutoPlay(true);

    this.adLoader.requestAds(adsRequest);
  }

  onLoaded(e) {
    let settings = new this.google.ima.AdsRenderingSettings();
    settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    // videoContent should be set to the content video element.
    this.adManager = e.getAdsManager(
      this.player.element, settings);

    // Add listeners to the required events.
    this.adManager.addEventListener(
      this.google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onError.bind(this));
    this.adManager.addEventListener(
      this.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      this.onPause.bind(this));
    this.adManager.addEventListener(
      this.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      this.onResume.bind(this));
    this.adManager.addEventListener(
      this.google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      this.onEvent.bind(this));

    // Listen to any additional events, if necessary.
    this.adManager.addEventListener(
      this.google.ima.AdEvent.Type.LOADED,
      this.onEvent.bind(this));
    this.adManager.addEventListener(
      this.google.ima.AdEvent.Type.STARTED,
      this.onEvent.bind(this));
    this.adManager.addEventListener(
      this.google.ima.AdEvent.Type.COMPLETE,
      this.onEvent.bind(this));

    var initWidth = this.player.element.clientWidth;
    var initHeight = this.player.element.clientHeight;
    //this.adManagerDimensions.width = initWidth;
    //this.adsManagerDimensions.height = initHeight;
    this.adManager.init(
      initWidth,
      initHeight,
      this.google.ima.ViewMode.NORMAL);
    this.adManager.resize(
      initWidth,
      initHeight,
      this.google.ima.ViewMode.NORMAL);

    if (!this.player.muted) {
      this.playAds();
    } else {
      this.player.element.addEventListener(
        'volumechange',
        this.playAds.bind(this));
    }
  }

  playAds() {

    if (this.initialized)
      return;

    this.initialized = true;
    this.element.nativeElement.style.display = 'block';
    this.player.autoplay = true;
    this.adContainer.initialize();

    try {
      // Initialize the ads manager. Ad rules playlist will start at this time.
      this.adManager.init(640, 360, this.google.ima.ViewMode.NORMAL);
      // Call play to start showing the ad. Single video and overlay ads will
      // start at this time; the call will be ignored for ad rules.
      this.adManager.start();
    } catch (err) {
      // An error may be thrown if there was a problem with the VAST response.
      //videoContent.play();
      console.log(err);
      this.element.nativeElement.style.display = 'none';
      return false;
    }

    return true;
  }

  onEvent(e) {
    // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
    // don't have ad object associated.
    var ad = e.getAd();
    switch (e.type) {
      case this.google.ima.AdEvent.Type.LOADED:
        if (!ad.isLinear()) {
          // Position AdDisplayContainer correctly for overlay.
          // Use ad.width and ad.height.
          //this.player.nativeElement.play();
        }
        break;
      case this.google.ima.AdEvent.Type.STARTED:
        // This event indicates the ad has started - the video player
        // can adjust the UI, for example display a pause button and
        // remaining time.
        //if (ad.isLinear()) {
        //}
        break;
      case this.google.ima.AdEvent.Type.COMPLETE:
        //if (ad.isLinear()) {
        //}
        this.element.nativeElement.style.display = 'none';
        break;
    }
  }

  onPause(e) {
    this.element.nativeElement.style.display = 'block';
    this.player.element.pause();
  }

  onResume(e) {
    this.player.element.play();
    this.element.nativeElement.style.display = 'none';
  }

  onError(e) {
    console.log(e.getError());
    this.adManager.destroy();
  }

  ngOnDestroy() {
    if (this.adManager)
      this.adManager.destroy();
  }

}
