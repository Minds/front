import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
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
export class BlurhashDirective implements AfterViewInit, OnDestroy {
  private RESOLUTION = 128;

  @HostBinding('attr.src')
  @Input()
  src: string;

  @Input('m-blurhashFullscreen')
  fullscreen: boolean;

  @HostListener('load')
  onLoad() {
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

  @Input('m-blurhash')
  entity: ActivityEntity;

  @Input('paywalled')
  paywalled;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.el.nativeElement.complete && !this.paywalled) {
      return null;
    }

    // preventing an ugly case where the canvas appears outside of image container
    timer(0)
      .toPromise()
      .then(() => this.drawCanvas());
  }

  /**
   * draws the blurhash canvas over the image
   * @returns { void }
   */
  drawCanvas() {
    const elementWidth = this.el?.nativeElement?.width;
    const elementHeight = this.el?.nativeElement?.height;

    let [blurhash, width, height] = [
      this.entity.blurhash || this.entity.custom_data[0]?.blurhash,
      elementWidth || this.entity.custom_data[0]?.width,
      elementHeight || this.entity.custom_data[0]?.height,
    ];

    if (!blurhash) {
      return null;
    }

    const aspecRatio = width / height;
    width = elementWidth;
    height = elementHeight || aspecRatio * elementWidth;

    if (!width || !height) {
      return null;
    }

    try {
      const pixels = decode(blurhash, this.RESOLUTION, this.RESOLUTION);
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
      if (this.el.nativeElement?.complete) {
        return;
      }

      this.canvas.setAttribute(
        'style',
        `position: absolute; top: 0; left: 0; transition: all 0.3s; transition-timing-function: ease-out; transform-origin: top left; ${dimensionsStyle}`
      );
      this.el.nativeElement.parentElement.append(this.canvas);
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
