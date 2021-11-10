import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { decode } from 'blurhash';

@Directive({
  selector: 'img[m-blurhash]',
})
export class BlurhashDirective implements AfterViewInit {
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
    if (this.canvas) {
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

  constructor(private el: ElementRef) {
    if (this.el?.nativeElement?.complete) {
      if (this.canvas) {
        this.canvas.style.opacity = 0;
      }
    }
  }

  ngAfterViewInit() {
    const elementWidth = this.el?.nativeElement?.width;
    const elementHeight = this.el?.nativeElement?.height;

    let { blurhash, width, height } = Object.assign(
      {
        blurhash: 'LyHnO9n$tUt7}qoOxAs:-BskngRj',
        width: elementWidth,
        height: elementHeight,
      },
      this.entity.custom_data[0]
    );

    const aspecRatio = width / height;
    width = elementWidth;
    height = aspecRatio * elementWidth;

    const pixels = decode(blurhash, width, height);

    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);

    ctx.putImageData(imageData, 0, 0);
    this.canvas.setAttribute(
      'style',
      // TODO: transition shouldn't happen if the image was already loaded
      `position: absolute; top: 0; left: 0; transition: all 0.3s; transition-timing-function: ease-out;`
    );
    this.el.nativeElement.parentElement.append(this.canvas);
  }
}
