import { Component } from '@angular/core';
import { AutoProgressVideoService } from './auto-progress-video.service';

@Component({
  selector: 'm-autoProgress__overlay',
  templateUrl: './auto-progress-overlay.component.html',
  styleUrls: ['./auto-progress-overlay.component.ng.scss'],
})
export class AutoProgressOverlayComponent {
  constructor(public autoProgress: AutoProgressVideoService) {}
}
