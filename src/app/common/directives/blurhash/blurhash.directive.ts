import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { decode } from 'blurhash';
import { timer } from 'rxjs';
import { ActivityEntity } from '../../../modules/newsfeed/activity/activity.service';

/**
 * Blurhash directive. apply it to any <img /> tag like so: <img m-blurhash="entity" />
 */
@Directive({
  selector: 'img[m-blurhash]',
})
export class BlurhashDirective implements OnInit, AfterViewInit, OnDestroy {
  private RESOLUTION = 128;

  @HostBinding('attr.src')
  @Input()
  src: string;

  @Input('m-blurhashFullscreen')
  fullscreen: boolean;

  @HostListener('load')
  onLoad() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (this.canvas && !this.paywalled) {
      this.removeCanvas();
    }
  }

  @HostListener('error')
  onError() {}

  @HostBinding('style.width.px')
  width: number;

  @HostBinding('style.height.px')
  height: number;

  canvas: HTMLCanvasElement;

  _blurhash: string;

  /**
   * the actual hash
   */
  get blurhash(): string {
    return this._blurhash;
  }

  /**
   * @param {ActivityEntity | string} blurhashInput a blurhash string or an entity
   */
  @Input('m-blurhash')
  set blurhash(blurhashInput: string | ActivityEntity) {
    if (!blurhashInput) {
      return;
    }

    switch (typeof blurhashInput) {
      case 'string':
        this._blurhash = blurhashInput;
        break;
      case 'object':
        this.entity = blurhashInput;
        this._blurhash =
          this.entity.blurhash || this.entity.custom_data?.[0]?.blurhash;
      default:
    }
  }

  entity?: ActivityEntity;

  @Input('paywalled')
  paywalled;

  get isLoadingComplete() {
    return this.el.nativeElement?.src && this.el.nativeElement?.complete;
  }

  constructor(
    private el: ElementRef<HTMLImageElement>,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (this.isLoadingComplete && !this.paywalled) {
      return;
    }

    // preventing an ugly case where the canvas appears outside of image container
    if (this.fullscreen) {
      this.drawCanvas();
    }
  }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (this.isLoadingComplete && !this.paywalled) {
      return null;
    }

    if (!this.fullscreen) {
      // preventing an ugly case where the canvas appears outside of image container
      timer(0)
        .toPromise()
        .then(() => this.drawCanvas());
    }
  }

  /**
   * draws the blurhash canvas over the image
   * @returns { void }
   */
  drawCanvas() {
    const elementWidth = this.el?.nativeElement?.width;
    const elementHeight = this.el?.nativeElement?.height;

    if (this.canvas) {
      return null;
    }

    if (!this.blurhash) {
      return null;
    }

    let [width, height] = [
      elementWidth || this.entity?.custom_data?.[0]?.width,
      elementHeight || this.entity?.custom_data?.[0]?.height,
    ];

    const aspecRatio = width / height;
    width = elementWidth;
    height = elementHeight || aspecRatio * elementWidth;

    if (!width || !height) {
      return null;
    }

    try {
      const pixels = decode(this.blurhash, this.RESOLUTION, this.RESOLUTION);
      this.canvas = document.createElement('canvas');
      const ctx = this.canvas.getContext('2d');

      ctx.canvas.width = this.RESOLUTION;
      ctx.canvas.height = this.RESOLUTION;

      const imageData = ctx.createImageData(this.RESOLUTION, this.RESOLUTION);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);

      let dimensionsStyle = '';

      if (this.fullscreen) {
        dimensionsStyle += `width: 100%; height: 100%`;
      } else {
        const scaleX = width / this.RESOLUTION;
        const scaleY = height / this.RESOLUTION;
        dimensionsStyle += `transform: scaleX(${scaleX}) scaleY(${scaleY})`;
      }

      // if image has loaded in the time we've been processing - do not set canvas.
      if (this.isLoadingComplete) {
        return;
      }

      this.canvas.setAttribute(
        'style',
        `position: absolute; top: 0; left: 0; transition: all 0.3s; transition-timing-function: ease-out; transform-origin: top left; ${dimensionsStyle}`
      );
      this.el.nativeElement.after(this.canvas);
    } catch (e) {
      console.error('Blurhash: failed to draw canvas', e);
    }
  }

  /**
   * removes the canvas element from DOM with a transition
   */
  removeCanvas() {
    this.canvas.style.opacity = '0';
    setTimeout(() => {
      this.canvas?.remove();
    }, 300);
  }

  ngOnDestroy() {
    this.canvas?.remove();
  }
}
