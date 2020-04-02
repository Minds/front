import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';

export class ThumbnailEvent {
  constructor(public source: any, public seconds: any) {}
}

@Component({
  selector: 'minds-media-thumbnail-selector',
  inputs: ['entity', 'thumbnailSrc', 'thumbnailFromFile'],
  outputs: ['thumbnail'],
  templateUrl: 'thumbnail-selector.component.html',
})
export class ThumbnailSelectorComponent {
  readonly cinemrUrl: string;
  @ViewChild('thumbnailInput', { static: true }) thumbnailInput: ElementRef;
  element: any;
  src: Array<any> = [];
  thumbnailSec: number = 0;
  thumbnail: EventEmitter<ThumbnailEvent> = new EventEmitter();
  canvas;
  inProgress: boolean = false;
  thumbnailSrc: string = '';
  originalThumbnailSrc: string = '';
  thumbnailFile: any;
  thumbnailFromFile: boolean = false;
  thumbnailNotChanged: boolean = true;

  selectedThumbnail: number = -1;
  thumbnails: string[] = [];

  private _entity: any;

  public set entity(value: any) {
    this._entity = value;

    this.src = this._entity.src['360.mp4'];
    if (this.element) this.element.src = this.src;
  }

  constructor(private _element: ElementRef, configs: ConfigsService) {
    this.cinemrUrl = configs.get('cinemr_url');
  }

  ngOnInit() {
    this.element = this._element.nativeElement.getElementsByTagName('video')[0];
    if (this.src) this.element.src = this.src;
    this.originalThumbnailSrc = this.thumbnailSrc;
    this.element.addEventListener('loadedmetadata', () => {
      this.element.currentTime = 0;
      this.inProgress = false;

      this.thumbnails = this.getThumbnails();
    });
  }

  getThumbnails(): string[] {
    //old system took thumbs every 10 seconds, new system takes 3 throughout
    const length: number =
      this._entity.time_created < 1523620800
        ? Math.round(this.element.duration / 10)
        : Math.round(Math.floor(this.element.duration));
    const secs: Array<number> = [1, Math.round(length / 2), length - 1];
    return this.getThumbnailUrls(secs);
  }

  getThumbnailUrls(nums: number[]): string[] {
    let thumbs: string[] = [];
    for (const num of nums) {
      const number = ('00000' + num).slice(-5); //adds padding to the number: 10 would become 00010
      thumbs.push(
        `${this.cinemrUrl}${this._entity.cinemr_guid}/thumbnail-${number}.png`
      );
    }

    return thumbs;
  }

  selectThumbnail(index: number) {
    const img = document.querySelector(
      `.m-thumbnail-selector--thumbnails-list > img:nth-child(${index + 1})`
    );
    this.selectedThumbnail = index;

    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1280;
      this.canvas.height = 720;
    }
    this.canvas
      .getContext('2d')
      .drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.thumbnail.next(
      new ThumbnailEvent(this.canvas.toDataURL('image/jpeg'), this.thumbnailSec)
    );
  }
  uploadThumbnail(event: any) {
    this.thumbnailInput.nativeElement.click();
  }

  addNewThumbnail(event: any) {
    this.inProgress = true;
    const element: any = event.target ? event.target : event.srcElement;
    this.thumbnailFile = element ? element.files[0] : null;

    // read file
    const reader = new FileReader();
    reader.onloadend = () => {
      // create a canvas
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1280;
      this.canvas.height = 720;
      const img: HTMLImageElement = document.createElement('img');

      let index = this.thumbnailFromFile
        ? this.thumbnails.length - 1
        : this.thumbnails.length;
      this.thumbnails[index] =
        typeof reader.result === 'string'
          ? reader.result
          : reader.result.toString();
      this.selectedThumbnail = index;

      img.src =
        typeof reader.result === 'string'
          ? reader.result
          : reader.result.toString();
      img.onload = () => {
        this.thumbnailSec = 0.1;
        this.canvas
          .getContext('2d')
          .drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        this.thumbnailSrc = this.canvas.toDataURL('image/jpeg');
        this.thumbnailFromFile = true;
        this.thumbnailNotChanged = false;
        this.thumbnail.next(
          new ThumbnailEvent(this.thumbnailSrc, this.thumbnailSec)
        );
        this.inProgress = false;
      };
    };
    reader.readAsDataURL(this.thumbnailFile);
    element.value = '';
  }
}
