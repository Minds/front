import { Component, Directive } from '@angular/core';

@Component({
  selector: 'minds-graph-pie',
  inputs: ['_data: data'],
  templateUrl: 'pie-graph.component.html'
})

export class PieGraph {

  data: Array<any>;
  segments: Array<any>;

  max: number = 156;
  radius: number = 25;
  diameter: number = 50;

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

    var r = 25;
    var c = Math.PI * (r * 2);

    for (var stat of this.data) {

      var value = stat.total;

      var offset = ((100 - value) / 100) * c;

      this.segments = [
        {
          array: c,
          offset: offset
        }
      ];
    }

  }



}
