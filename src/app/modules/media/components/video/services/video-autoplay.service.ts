import { Injectable, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs';
import { MindsVideoPlayerComponent } from '../../video-player/player.component';
import { ScrollService } from '../../../../../services/ux/scroll';
import { Session } from '../../../../../services/session';

@Injectable()
export class VideoAutoplayService implements OnDestroy {
  public muted: boolean = true;

  protected scroll$: Subscription;

  protected enabled: boolean = true;

  /**
   * This is set when the player manually triggers a playback
   */
  protected userPlaying: MindsVideoPlayerComponent;

  /**
   * This is the current autoplaying video (only for autoplay on scroll)
   */
  protected currentlyPlaying: MindsVideoPlayerComponent;

  /**
   * List of registered players for autoplay on scroll
   */
  protected players: MindsVideoPlayerComponent[] = [];

  constructor(
    protected scroll: ScrollService,
    protected session: Session,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    const user = this.session.getLoggedInUser();

    this.setEnabled(user.plus && !user.disable_autoplay_videos);

    this.init();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    return this;
  }

  /**
   * Registers a player component in the list of autoplayable players
   * @param player
   */
  registerPlayer(player: MindsVideoPlayerComponent) {
    if (isPlatformServer(this.platformId)) return;

    this.players.push(player);

    // sort players by Y their positions in axis so we prioritize visibility on videos that are closer to the top
    this.players.sort((a, b) => {
      const rect1 = a.elementRef.nativeElement.getBoundingClientRect();
      const rect2 = a.elementRef.nativeElement.getBoundingClientRect();

      return rect1.top - rect2.top;
    });
    return this;
  }

  /**
   * Removes a player from the list of autoplayable players
   * @param player
   */
  unregisterPlayer(player: MindsVideoPlayerComponent) {
    const index = this.players.findIndex((value) => value === player);

    if (index !== -1) {
      this.players.splice(index, 1);
    }

    return this;
  }

  init(): void {
    this.scroll$ = this.scroll.listenForView().subscribe(() => {
      this.checkVisibility();
    });
  }

  /**
   * Checks the visibility of all registered players
   */
  checkVisibility(): void {
    if (!this.enabled) {
      return;
    }

    // 33% of the window
    const offsetRange = this.scroll.view.clientHeight / 3;
    const clientTop = this.scroll.view.getBoundingClientRect().top;

    const offsetTop = clientTop + this.scroll.view.scrollTop + offsetRange;
    const offsetBottom = offsetTop + offsetRange;

    let foundSuitablePlayer: boolean = false;

    for (const item of this.players) {
      const htmlElement = item.elementRef.nativeElement;

      if (!htmlElement) {
        continue;
      }

      // if we already triggered playback in this loop, the rest should just stop
      if (foundSuitablePlayer) {
        this.stopPlaying(item);
        continue;
      }

      const rect = htmlElement.getBoundingClientRect();

      const y1 = rect.top;
      const y2 = offsetTop;
      if (y1 + rect.height < y2 || y1 > offsetBottom) {
        this.stopPlaying(item);
      } else {
        this.tryAutoplay(item);
        foundSuitablePlayer = true;
      }
    }
  }

  /**
   * Autoplays the video if the user isn't watching another one
   * @param player
   */
  tryAutoplay(player: MindsVideoPlayerComponent): void {
    if (!this.userPlaying || !this.userPlaying.isPlaying()) {
      if (this.currentlyPlaying && this.currentlyPlaying !== player) {
        this.currentlyPlaying.stop();
      }
      if (player && !player.isPlaying()) {
        // .play() and .mute() will get called when plyr emits the 'ready' event
        // player.setAutoplaying(true);
        this.currentlyPlaying = player;
      }
    }
  }

  /**
   * Stops autoplay
   * @param player
   */
  stopPlaying(player: MindsVideoPlayerComponent): void {
    if (!this.userPlaying && player) {
      // player.setAutoplaying(false);
    }
  }

  /**
   * Called by the video player when the user manually triggers playback
   * @param player
   */
  userPlay(player: MindsVideoPlayerComponent): void {
    const user = this.session.getLoggedInUser();
    if (user.plus && !user.disable_autoplay_videos) {
      this.userPlaying = player;
    }
  }

  ngOnDestroy(): void {
    this.scroll.unListen(this.scroll$);
  }
}
