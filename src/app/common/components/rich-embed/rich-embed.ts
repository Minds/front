import { SiteService } from './../../services/site.service';
import {
  Component,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
  HostBinding,
  SkipSelf,
  HostListener,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RichEmbedService } from '../../../services/rich-embed';
import { MediaProxyService } from '../../../common/services/media-proxy.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';
import { EmbedLinkWhitelistService } from '../../../services/embed-link-whitelist.service';
import {
  ClientMetaData,
  ClientMetaService,
} from '../../services/client-meta.service';
import { ClientMetaDirective } from '../../directives/client-meta.directive';
import { LivestreamService } from '../../../modules/composer/services/livestream.service';
import { IsTenantService } from '../../services/is-tenant.service';
import { IntersectionObserverService } from '../../services/intersection-observer.service';
import { Subscription } from 'rxjs';

interface InlineEmbed {
  id: string;
  className: string;
  html?: SafeHtml;
  htmlProvisioner?: () => Promise<SafeHtml>;
  playable: boolean;
}

@Component({
  selector: 'm-richEmbed',
  inputs: ['_src: src', '_preview: preview', 'maxheight', 'cropImage'],
  templateUrl: 'rich-embed.html',
  styleUrls: ['rich-embed.ng.scss'],
})
export class MindsRichEmbed implements OnDestroy {
  @Input() displayAsColumn: boolean = false;

  @Input() set isModal(value: boolean) {
    this._isModal = value;
    if (value) {
      this.hasModalRequestObservers = false;
      if (this.mediaSource !== 'minds') {
        this.embeddedInline = true;
      }
      this.detectChanges();
    }
  }

  @Output() mediaModalRequested: EventEmitter<any> = new EventEmitter();

  type: string = '';
  mediaSource: string = '';
  playbackId?: string = '';
  isOwner: boolean = false;
  src: any = {};
  streamRecording: any = null;
  preview: any = {};
  maxheight: number = 320;
  inlineEmbed: InlineEmbed = null;
  cropImage: boolean = false;
  hasModalRequestObservers: boolean = false;

  private lastInlineEmbedParsed: string;
  public isPaywalled: boolean = false;
  _isModal: boolean = false;

  // set to true once a click is recorded.
  private clickRecorded: boolean = false;

  embeddedInline: boolean = false;

  //---------------
  // these are used just for youtube vids on tenant sites for now
  private intersectionObserverSubscription: Subscription;
  youtubeVideoId: string;
  userDisabledAutoplay: boolean = false;
  // ---------------

  @HostBinding('class.m-richEmbed__display--rows')
  get displayAsRows(): boolean {
    return !this.isFeaturedSource && !this.displayAsColumn;
  }

  @HostBinding('class.m-richEmbed__display--columns')
  get displayAsColumns(): boolean {
    return this.isFeaturedSource || this.displayAsColumn;
  }

  // on component host click, record a click event.
  @HostListener('click') onHostClick(): void {
    this.recordClick();
  }

  constructor(
    private sanitizer: DomSanitizer,
    private session: Session,
    private service: RichEmbedService,
    private cd: ChangeDetectorRef,
    private mediaProxy: MediaProxyService,
    private configs: ConfigsService,
    private site: SiteService,
    private modalService: ModalService,
    private embedLinkWhitelist: EmbedLinkWhitelistService,
    private clientMetaService: ClientMetaService,
    private livestreamService: LivestreamService,
    private isTenant: IsTenantService,
    private el: ElementRef,
    private intersectionObserver: IntersectionObserverService,
    @SkipSelf() private parentClientMeta: ClientMetaDirective
  ) {}

  /**
   * The entity that has a rich embed.
   * Can be activity or comment
   */
  set _src(value: any) {
    if (!value) {
      return;
    }

    /**
     * Make a copy of the source entity
     */
    this.src = Object.assign({}, value);
    this.type = 'src';

    if (this.src.thumbnail_src) {
      this.src.thumbnail_src = this.mediaProxy.proxy(
        this.src.thumbnail_src,
        800
      );
    }

    this.isOwner =
      this.src.ownerObj.guid === this.session.getLoggedInUser().guid;

    this.isPaywalled =
      this.src.paywall && !this.src.paywall_unlocked && !this.isOwner;

    this.init();
  }

  set _preview(value: any) {
    if (!value) {
      return;
    }

    this.preview = Object.assign({}, value);
    this.type = 'preview';

    if (this.preview.thumbnail) {
      this.preview.thumbnail = this.mediaProxy.proxy(
        this.preview.thumbnail,
        800
      );
    }

    this.init();
  }

  init() {
    // Create inline embed object
    let inlineEmbed = this.parseInlineEmbed(this.inlineEmbed);

    if (
      this.mediaSource === 'minds' ||
      this.mediaSource === 'scribd' ||
      (this.mediaSource === 'youtube' && !this.isTenant.is())
    ) {
      this.hasModalRequestObservers =
        this.mediaModalRequested.observers.length > 0;
    }

    if (
      inlineEmbed &&
      inlineEmbed.id &&
      this.inlineEmbed &&
      this.inlineEmbed.id
    ) {
      // Do not replace if ID codes are the same
      // This is needed because angular sometimes replaces the innerHTML
      // of the embedded player and restarts the videos
      if (inlineEmbed.id === this.inlineEmbed.id) {
        return;
      }
    }

    this.inlineEmbed = inlineEmbed;
    if (inlineEmbed?.playable) {
      // Embed youtube inline for tenants
      if (this.mediaSource === 'youtube' && this.isTenant.is()) {
        this.embeddedInline = true;
      }
      // If you can open it in a modal, only render html
      // if a parent is listening for the modal request
      if (this.modalService.canOpenInModal()) {
        if (this.hasModalRequestObservers) {
          this.provisionHtml();
        }
      } else {
        this.provisionHtml();
      }
    }

    if (this.mediaSource === 'livepeer') {
      this.getLiveStreamInfo();
    }

    if (this.mediaSource === 'scribd') {
      this.embeddedInline = true;
    }
  }

  /**
   * Provisions the html of the inlineEmbed unto the component
   * if there is an html provisioner (i.e. if mediaSource is soundcloud)
   * @returns { void }
   */
  provisionHtml(): void {
    this.inlineEmbed.htmlProvisioner?.().then((html) => {
      this.inlineEmbed = { ...this.inlineEmbed, html: html };
    });
    // @todo: catch any error here and forcefully window.open to destination
  }

  action($event) {
    this.recordClick();

    if (this.hasModalRequestObservers && this.modalService.canOpenInModal()) {
      $event.preventDefault();
      $event.stopPropagation();

      this.mediaModalRequested.emit();
      return;
    }

    if (this.inlineEmbed && !this.embeddedInline) {
      $event.preventDefault();
      $event.stopPropagation();

      this.embeddedInline = true;
      this.provisionHtml();
    }
  }

  parseInlineEmbed(current?: any): InlineEmbed {
    if (!this.src || !this.src.perma_url) {
      return null;
    }

    let url = this.src.perma_url,
      matches;

    // Don't reparse if we've already done it
    if (url === this.lastInlineEmbedParsed) {
      return current;
    }

    this.lastInlineEmbedParsed = url;

    // Minds blog
    const siteUrl = this.configs.get('site_url');
    if (url.indexOf(siteUrl) === 0) this.mediaSource = 'minds';

    // YouTube
    let youtube =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/i;

    if ((matches = youtube.exec(url)) !== null) {
      if (matches[1]) {
        this.youtubeVideoId = matches[1];
        this.mediaSource = 'youtube';

        // Set up for handling autoplaying youtube videos in the feed
        // on tenant sites
        if (this.isTenant.is() && !this.isModal) {
          this.setUserDisabledAutoplay();

          if (!this.userDisabledAutoplay) {
            this.setupIntersectionObserver();
          }
        }

        return {
          id: `video-youtube-${this.youtubeVideoId}`,
          className:
            'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-youtube',
          html: this.getYoutubeHtml(),
          playable: true,
        };
      }
    }

    // Vimeo
    let vimeo = /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/i;

    if ((matches = vimeo.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'vimeo';
        return {
          id: `video-vimeo-${matches[1]}`,
          className:
            'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-vimeo',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe
          src="https://player.vimeo.com/video/${matches[1]}?title=0&byline=0&portrait=0"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`),
          playable: true,
        };
      }
    }

    // Scribd
    let scribd = this.embedLinkWhitelist.getRegex('scribd');

    if ((matches = scribd.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'scribd';
        return {
          id: `document-scribd-${matches[1]}`,
          className: 'm-rich-embed-document-scribd',
          html: this.sanitizer.bypassSecurityTrustHtml(
            `<iframe
              src="https://www.scribd.com/embeds/${matches[1]}/content"
              frameborder="0"
            ></iframe>`
          ),
          playable: false,
        };
      }
    }

    // SoundCloud
    let soundcloud =
      /^(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([a-z0-9\-\/]+)/i;

    if ((matches = soundcloud.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'soundcloud';
        return {
          id: `audio-soundcloud-${matches[1]}`,
          className:
            'm-rich-embed-audio m-rich-embed-audio-iframe m-rich-embed-audio-soundcloud',
          htmlProvisioner: () => {
            return this.service
              .soundcloud(url, this.maxheight)
              .then((response) => {
                if (!response.id) {
                  return 'Error on soundcloud embed';
                }
                return this.sanitizer.bypassSecurityTrustHtml(`<iframe
                width="100%" height="400" scrolling="no" frameborder="no"
                src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F${response.id}&show_artwork=true&auto_play=true&show_comments=true">
                </iframe>`);
              });
          },
          playable: true,
        };
      }
    }

    // Spotify
    let spotify = /^(?:https?:\/\/)?open\.spotify\.com\/track\/([a-z0-9]+)/i;

    if ((matches = spotify.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'spotify';
        return {
          id: `audio-spotify-${matches[1]}`,
          className:
            'm-rich-embed-audio m-rich-embed-audio-iframe m-rich-embed-audio-spotify',
          html: this.sanitizer.bypassSecurityTrustHtml(`<iframe
          style="height: ${this.maxheight}px;"
          src="https://embed.spotify.com/?uri=spotify:track:${matches[1]}"
          frameborder="0" allowtransparency="true"></iframe>`),
          playable: true,
        };
      }
    }

    // Giphy
    let giphy = /^(?:https?:\/\/)?(?:www\.)?giphy\.com\/gifs\/([a-z0-9\-]+)/i;

    if ((matches = giphy.exec(url)) !== null) {
      if (matches[1]) {
        let idTokens: string[] = matches[1].split('-'),
          id: string = idTokens.pop();

        if (!id) {
          return null;
        }
        this.mediaSource = 'giphy';
        return {
          id: `image-giphy-${matches[1]}`,
          className:
            'm-rich-embed-image m-rich-embed-image-iframe m-rich-embed-image-giphy',
          html: this.sanitizer
            .bypassSecurityTrustHtml(`<iframe src="//giphy.com/embed/${id}"
          frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`),
          playable: true,
        };
      }
    }

    // Odysee
    const odysee: RegExp = this.embedLinkWhitelist.getRegex('odysee');

    if ((matches = odysee.exec(url)) !== null) {
      if (matches[2]) {
        this.mediaSource = 'odysee';

        return {
          id: `video-odysee-${matches[2]}`,
          className:
            'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-odysee',
          html: this.sanitizer.bypassSecurityTrustHtml(
            '<iframe id="odysee-iframe" width="560" height="315" src="' +
              matches[0] +
              '" allowfullscreen></iframe>'
          ),
          playable: true,
        };
      }
    }

    // Rumble
    const rumble: RegExp = this.embedLinkWhitelist.getRegex('rumble');

    if ((matches = rumble.exec(url)) !== null) {
      if (matches[1]) {
        this.mediaSource = 'rumble';

        return {
          id: `video-rumble-${matches[1]}`,
          className:
            'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-rumble',
          html: this.sanitizer.bypassSecurityTrustHtml(
            '<iframe class="rumble" width="640" height="360" src="' +
              matches[0] +
              '?pub=4" frameborder="0" allowfullscreen></iframe>'
          ),
          playable: true,
        };
      }
    }

    // Livepeer

    // Patch legacy livepeer URLs.
    if (this.embedLinkWhitelist.getRegex('livepeerLegacy').test(url)) {
      url = url.replace(
        'minds-player.withlivepeer.com',
        'minds-player.vercel.app'
      );
    }

    const livepeer: RegExp = this.embedLinkWhitelist.getRegex('livepeer');

    if ((matches = livepeer.exec(url)) !== null) {
      if (matches[0]) {
        this.mediaSource = 'livepeer';
        this.playbackId = matches[4];

        const autoplayDisabled: boolean =
          this.session.getLoggedInUser()?.disable_autoplay_videos ?? true;
        const url: URL = new URL(matches[0]);
        url.searchParams.set('autoplay', autoplayDisabled ? 'false' : 'true');

        return {
          id: `video-livepeer-${matches[4]}`,
          className:
            'm-rich-embed-video m-rich-embed-video-iframe m-rich-embed-video-livepeer',
          html: this.sanitizer.bypassSecurityTrustHtml(
            '<iframe class="livepeer" width="640" height="360" src="' +
              `${url.href}` +
              '" frameborder="0" allowfullscreen></iframe>'
          ),
          playable: true,
        };
      }
    }

    // No match
    return null;
  }

  /**
   * Make these ones big (displayed as column)
   */
  get isFeaturedSource(): boolean {
    return (
      this.mediaSource === 'youtube' ||
      this.mediaSource === 'minds' ||
      this.mediaSource === 'scribd'
    );
  }

  async getLiveStreamInfo() {
    const streamId = await this.livestreamService.getStreamFromPlayback(
      this.playbackId
    );
    const recording = await this.livestreamService.getRecording(streamId);
    if (streamId) {
      this.streamRecording = recording;
    } else {
      return;
    }
  }

  downloadRecording() {
    window.open(this.streamRecording.downloadUrl);
  }

  isLivestream() {
    return this.mediaSource == 'livepeer';
  }

  hasInlineContentLoaded() {
    return (
      this.embeddedInline &&
      this.inlineEmbed &&
      this.inlineEmbed?.html &&
      (!this.hasModalRequestObservers || !this.modalService.canOpenInModal())
    );
  }

  getRel() {
    return this.site.getLinkRel(this.src.perma_url);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Record a click event on the rich embed.
   * @returns { void }
   */
  private recordClick(): void {
    if (this.clickRecorded) {
      return;
    }
    this.clickRecorded = true;

    const extraClientMetaData: Partial<ClientMetaData> = {};

    if (Boolean(this.src.boosted_guid) && Boolean(this.src.urn)) {
      extraClientMetaData.campaign = this.src.urn;
    }

    this.clientMetaService.recordClick(
      this.src.guid,
      this.parentClientMeta,
      extraClientMetaData
    );
  }

  private setUserDisabledAutoplay(): void {
    if (this.session.getLoggedInUser()?.disable_autoplay_videos) {
      this.userDisabledAutoplay = true;
    }
  }

  /**
   * Get the html for youtube iframe.
   * Allows autoplay flag to be set
   * So we can customize for different scenarios
   * (e.g. we want youtube to autoplay in feed on tenant sites)
   * @returns SafeHtml
   */
  private getYoutubeHtml(autoplayOverride?: boolean): SafeHtml {
    let origin = window.location.host;

    // On minds.com, we can always enable autoplay bc
    // the video will only autoplay in the modal.
    let autoplay = '1';

    // On tenant sites, we want youtube to autoplay in the feed.
    // we need to wait until it scrolls into view so we start by turning
    // autoplay off
    if (this.isTenant.is()) {
      autoplay = '0';
    }

    if (autoplayOverride) {
      autoplay = autoplayOverride ? '1' : '0';
    }

    return this.sanitizer.bypassSecurityTrustHtml(`<iframe
      src="https://www.youtube.com/embed/${this.youtubeVideoId}?controls=1&modestbranding=1&origin=${origin}&rel=0&autoplay=${autoplay}&mute=1"
      frameborder="0"
      allowfullscreen ></iframe>`);
  }

  /**
   * Setup IntersectionObserver to watch for rich embeds entering
   * and leaving the viewport - emits once one has entered for more than a
   * half second
   * @returns { void }
   */
  private setupIntersectionObserver(): void {
    if (this.intersectionObserverSubscription) {
      console.warn('Attempted to re-register rich embed IntersectionObserver');
      return;
    }

    this.intersectionObserverSubscription = this.intersectionObserver
      .createAndObserve(this.el)
      .subscribe((isVisible: boolean) => {
        // We only want to change autoplay when visible on tenant sites when the user
        // hasn't disabled autoplay
        if (!this.isTenant.is() || this.isModal || this.userDisabledAutoplay) {
          return;
        }
        if (isVisible) {
          this.inlineEmbed.html = this.getYoutubeHtml(true);
        } else {
          this.inlineEmbed.html = this.getYoutubeHtml(false);
        }
        this.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.intersectionObserverSubscription?.unsubscribe();
  }
}
