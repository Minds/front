import { Component, Input} from '@angular/core';
import { MindsPlayerInterface } from '../players/player.interface';

@Component({
  selector: 'm-video--volume-slider',
  templateUrl: 'volume-slider.component.html'
})

export class MindsVideoVolumeSlider {
  @Input('player') playerRef: MindsPlayerInterface;

  element: HTMLVideoElement;
  
  ngOnInit() {
    this.bindToElement();
  }

  ngAfterViewInit() {
    this.bindToElement();
  }

  bindToElement() {
    if (this.playerRef.getPlayer()) {
      this.element = this.playerRef.getPlayer();
    }
  }
}
