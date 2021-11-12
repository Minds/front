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

@Directive({
  selector: 'img[m-blurhash]',
})
export class BlurhashDirective implements AfterViewInit, OnDestroy {
  private RESOLUTION = 128;
  private _src: string;

  @HostBinding('attr.src')
  @Input()
  set src(src: string) {
    this._src = src;
  }

  get src() {
    return this._src;
  }

  @HostListener('load')
  onLoad() {
    if (this.canvas && !this.paywalled) {
      // TODO: also remove the canvas after transition is done
      this.canvas.style.opacity = 0;
    }
  }

  @HostListener('error')
  onError() {
    // TODO
  }

  @HostBinding('style.width.px')
  width: number;

  @HostBinding('style.height.px')
  height: number;

  canvas;

  @Input('m-blurhash')
  entity;

  @Input('paywalled')
  paywalled;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // if image was loaded, don't bother
    if (this.el.nativeElement.complete) {
      return null;
    }

    // preventing an ugly case where the canvas appears outside of image container
    timer(0)
      .toPromise()
      .then(() => this.drawCanvas());
  }

  drawCanvas() {
    const elementWidth = this.el?.nativeElement?.width;
    const elementHeight = this.el?.nativeElement?.height;

    let { blurhash, width, height } = Object.assign(
      {},
      {
        // NOTE: not sure if we should have a default blurhash
        // blurhash: 'LyHnO9n$tUt7}qoOxAs:-BskngRj',
        width: elementWidth,
        height: elementHeight,
        // the blurhash might also be on this key
        blurhash: this.entity.blurhash,
      },
      this.entity.custom_data[0]
    );

    if (!blurhash) {
      return null;
    }

    const aspecRatio = width / height;
    width = elementWidth;
    height = elementHeight || aspecRatio * elementWidth;

    if (!width || !height) {
      return null;
    }

    const pixels = decode(blurhash, this.RESOLUTION, this.RESOLUTION);
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');

    ctx.canvas.width = this.RESOLUTION;
    ctx.canvas.height = this.RESOLUTION;

    const imageData = ctx.createImageData(this.RESOLUTION, this.RESOLUTION);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    const scaleX = width / this.RESOLUTION;
    const scaleY = height / this.RESOLUTION;

    this.canvas.setAttribute(
      'style',
      `position: absolute; top: 0; left: 0; transition: all 0.3s; transition-timing-function: ease-out; transform-origin: top left; transform: scaleX(${scaleX}) scaleY(${scaleY})`
    );
    this.el.nativeElement.parentElement.append(this.canvas);
  }

  ngOnDestroy() {
    this.canvas?.remove();
  }
}
