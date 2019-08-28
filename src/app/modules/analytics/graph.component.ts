import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-graph',
  template: `
    <plotly-plot
      [data]="data"
      [layout]="_layout"
      [config]="_config"
    ></plotly-plot>
  `,
})
export class Graph {
  @Input() data;
  @Input() layout;
  @Input() config;

  get _config() {
    return {
      ...this.config,
      ...{
        displayModeBar: false,
      },
    };
  }

  get _layout() {
    return {
      ...this.layout,
      /*...{
        margin: {
          t: 0,
          b: 0,
        },
        },*/
    };
  }
}
