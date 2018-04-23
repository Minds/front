import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-video--quality-selector',
  templateUrl: 'quality-selector.component.html'
})

export class MindsVideoQualitySelector {
  @Input() current: string;
  @Output('select') selectEmitter: EventEmitter<string> = new EventEmitter();

  qualities: string[] = [];
  @Input('qualities') set _qualities(qualities) {
    if (!qualities || !qualities.length) {
      this.qualities = [];
      return;
    }

    this.qualities = qualities
      .map(quality => quality)
      .sort((a, b) => parseFloat(b) - parseFloat(a));
  }

  selectQuality(quality) {
    this.current = quality;
    this.selectEmitter.emit(quality);
  }
}
