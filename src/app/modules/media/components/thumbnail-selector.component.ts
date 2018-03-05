import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';

import { Client } from '../../../services/api';

export class ThumbnailEvent {
     constructor(public source: any,
                public seconds: any) { }
}

@Component({
  selector: 'minds-media-thumbnail-selector',
  inputs: ['_src: src', 'thumbnailSrc', 'thumbnailFromFile' ],
  outputs: ['thumbnail'],
  templateUrl: 'thumbnail-selector.component.html' 
})

export class ThumbnailSelectorComponent {

  @ViewChild('thumbnailInput') thumbnailInput: ElementRef;
  element: any;
  src: Array<any> = [];
  thumbnailSec: number = 0;
  thumbnail: EventEmitter<ThumbnailEvent> = new EventEmitter();
  canvas;
  inProgress: boolean = false;
  thumbnailSrc: string = '';
  originalThumbnailSrc: string = '';
  thumbnailFile : any;
  thumbnailFromFile: boolean = false;
  thumbnailNotChanged: boolean = true;
  
  constructor(private _element: ElementRef) {
  }

  ngOnInit() {
    this.element = this._element.nativeElement.getElementsByTagName('video')[0];
    if (this.src)
      this.element.src = this.src;
    this.originalThumbnailSrc = this.thumbnailSrc;
    this.element.addEventListener('loadedmetadata', () => {
      this.element.currentTime = 0;
      this.inProgress = false;
    });
  }

  set _src(value: any) {
    this.src = value[0].uri;
    if (this.element)
      this.element.src = this.src;
  }

  seek(e) {
    e.preventDefault();
    var seeker = e.target;
    var seek = e.offsetX / seeker.offsetWidth;
    var seconds = this.seekerToSeconds(seek);
    this.element.currentTime = seconds;
    this.thumbnailSec = seconds;
    this.thumbnailNotChanged = false;
    this.createThumbnail();
    return false;
  }

  seekerToSeconds(seek) {
    var duration = this.element.duration;
    console.log('seeking to ', duration * seek);
    return duration * seek;
  }

  createThumbnail() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1280;
      this.canvas.height = 720;
    }
    this.inProgress = true;
    this.element.addEventListener('seeked', () => {
      //console.log(this.element.videoWidth, this.canvas.toDataURL("image/jpeg"));
      this.canvas.getContext('2d').drawImage(this.element, 0, 0, this.canvas.width, this.canvas.height);
      this.thumbnail.next(new ThumbnailEvent(this.canvas.toDataURL("image/jpeg"), this.thumbnailSec));
      this.inProgress = false;
    });
  }


  uploadThumbnail(event: any) {
    this.thumbnailInput.nativeElement.click();
  }
  
  addNewThumbnail(event: any) {
    this.inProgress = true;
    const element : any = event.target ? event.target : event.srcElement;
    this.thumbnailFile = element ? element.files[0] : null;
    
    // read file
    const reader  = new FileReader();
    reader.onloadend = () => {
      // create a canvas
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1280;
      this.canvas.height = 720;
      const img: HTMLImageElement = document.createElement('img');
      img.src = reader.result;
      img.onload = () => {
        this.thumbnailSec = 0.1;
        this.canvas.getContext('2d').drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        this.thumbnailSrc = this.canvas.toDataURL("image/jpeg");
        this.thumbnailFromFile = true;
        this.thumbnailNotChanged = false;
        this.thumbnail.next(new ThumbnailEvent(this.thumbnailSrc, this.thumbnailSec));
        this.inProgress = false;
      }
    };
    reader.readAsDataURL(this.thumbnailFile);
    element.value = "";
  }
  
  removeCustomThumbnail(e) {
    this.thumbnailFromFile = false;
    this.thumbnailNotChanged = true;
    this.thumbnailSrc = this.originalThumbnailSrc;
    this.element.currentTime = this.thumbnailSec;
    this.createThumbnail();
  }

  useOriginal() {
    this.thumbnailFromFile = false;
    this.thumbnailNotChanged = true;
    this.thumbnailSrc = this.originalThumbnailSrc;
  }

}
