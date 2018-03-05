import { Component, Input, Output, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-video--volume-slider',
  templateUrl: 'volume-slider.component.html'
})

export class MindsVideoVolumeSlider {
  @Input('element') element: any;
  
  constructor() {}
}
