import { Component, Directive } from '@angular/core';

@Component({
  selector: 'minds-graph-line',
  inputs: ['_data: data', 'y: height', 'x: width'],
  template: `
    <div [hidden]="!data"> <!-- Angular has svg problems... -->
      <svg fill="currentColor"
        [svgHack]
        [viewBox]="'0 0 ' + x + ' ' + y"
        style="stroke:#757575; opacity:0.8; overflow:visible; max-width:100%;"
        xmlns="http://www.w3.org/2000/svg">
        <!-- X Y, X Y (from top to bottom) -->
        <g class="points">
          <polyline [points]="points"
            style="fill:none;stroke-width:5;stroke-linejoin:round;"
          />
        </g>

      </svg>
    </div>
    <div class="mdl-spinner mdl-js-spinner is-active" [hidden]="data"></div>
  `
})

export class LineGraph {

  data: Array<any>;
  points: string = '0 200, 500 0';

  y: number = 200;
  x: number = 500;
  y_padding: number = 0;

  constructor() {
    //this.calculate();
  }

  set _data(value: any) {
    if (!value)
      return;
    this.data = value;
    this.calculate();
  }

  getBounds() {
    var max = 0;
    for (var stat of this.data) {
      if (stat.total > max)
        max = stat.total;
    }
    return max;
  }

  calculate() {

    var y_bounds = this.getBounds();
    var y_divi = (y_bounds + this.y_padding) / this.y;

    var x_count: number = this.data.length;
    var x_diff: number = this.x / (x_count - 1);
    var x_ticker: number = 0;

    //this.points = x_ticker + " " + this.y;
    this.points = '';
    for (var stat of this.data) {
      var y_stat = this.y - (stat.total / y_divi) - (this.y_padding);
      this.points += x_ticker + ' ' + y_stat + ',';
      x_ticker = x_ticker + x_diff;
    }
    this.points = this.points.slice(0, -1);

  }



}
