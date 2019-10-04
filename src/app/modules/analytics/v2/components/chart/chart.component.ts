// TODO: rework with angular-plotly
// Working version: https://codepen.io/omadrid/pen/NWKZYrV?editors=0010

import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  AnalyticsDashboardService,
  Category,
  Response,
  Dashboard,
  Filter,
  Option,
  Metric,
  Summary,
  Visualisation,
  Bucket,
  Timespan,
  UserState,
} from '../../dashboard.service';

import * as Plotly from 'plotly.js';
import { Config, Data, Layout } from 'plotly.js'; // TODO: remove this?
import { ThemeService } from '../../../../../common/services/theme.service';

@Component({
  selector: 'm-analytics__chart',
  templateUrl: 'chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChartComponent implements OnInit, OnDestroy {
  // TODO: buckets
  // @Input('buckets') set bucket(buckets) {
  //   this.x = buckets.map((row) => row.date)); // or key(ms)?
  //   this.y = buckets.map((row) => row.value));
  // };

  // - TEMP DATA-----------------------------------------

  segments = [
    {
      type: 'chart',
      buckets: [
        {
          key: 1567382400000,
          date: '2019-09-02T00:00:00+00:00',
          value: 3,
        },
        {
          key: 1567468800000,
          date: '2019-09-03T00:00:00+00:00',
          value: 0.5,
        },
        {
          key: 1567555200000,
          date: '2019-09-04T00:00:00+00:00',
          value: 5,
        },
        {
          key: 1567468800000,
          date: '2019-09-05T00:00:00+00:00',
          value: 6.5,
        },
        {
          key: 1567555200000,
          date: '2019-09-06T00:00:00+00:00',
          value: 21,
        },
      ],
    },
    {
      type: 'chart',
      buckets: [
        {
          key: 1567382400000,
          date: '2019-08-02T00:00:00+00:00',
          value: 1.5,
        },
        {
          key: 1567468800000,
          date: '2019-08-03T00:00:00+00:00',
          value: 11,
        },
        {
          key: 1567555200000,
          date: '2019-08-04T00:00:00+00:00',
          value: 3,
        },
        {
          key: 1567468800000,
          date: '2019-08-05T00:00:00+00:00',
          value: 6,
        },
        {
          key: 1567555200000,
          date: '2019-08-06T00:00:00+00:00',
          value: 7,
        },
      ],
    },
  ];

  dates;
  datesTemp = ['07/21', '07/22', '07/23', '07/24', '07/25'];

  // ---------------------------------------------------

  visualisation: Visualisation;

  isDark: boolean = false;
  subscription: Subscription;
  themeSubscription: Subscription;

  data: Array<any> = [];
  layout: any;
  config: any = {
    displayModeBar: false,
    responsive: true, // Doesn't do anything
  };

  // TODO: change name of 'thisPoint' & remove default val
  thisPoint = 2;
  defaultMarkerSize = 10;
  defaultMarkerOpacity = 0;
  hoverMarkerOpacity = 1;
  defaultMarkerOpacities = [];
  hoverMarkerOpacities = [];
  hoverVertLines = { shapes: [] };
  segmentLength = 3; // TODO: remove default

  graphDiv: any;
  hoverInfoDiv: any;
  // TODO: get these from parent instead
  hoverInfoXDiv: any;
  hoverInfoYDiv: any;
  hoverInfoComparisonXyDiv: any;

  hoverInfoTextX: string;
  hoverInfoTextY: string;
  hoverInfoTextComparisonXy: string;

  // THEMES
  segmentColorIds = [
    'm-blue',
    'm-grey-160',
    'm-amber-dark',
    'm-green-dark',
    'm-red-dark',
    'm-blue-grey-500',
  ];

  palette = [
    {
      id: 'm-white',
      themeMap: ['#fff', '#161616'],
    },
    {
      id: 'm-grey-50-transparent',
      themeMap: ['rgba(232,232,232,0)', 'rgba(53,53,53,0)'],
    },
    {
      id: 'm-grey-50',
      themeMap: ['rgba(232,232,232,1)', 'rgba(53,53,53,1)'],
    },
    {
      id: 'm-grey-70',
      themeMap: ['#eee', '#333'],
    },
    {
      id: 'm-grey-130',
      themeMap: ['#ccc', '#555'],
    },
    {
      id: 'm-grey-160',
      themeMap: ['#bbb', '#555'],
    },
    {
      id: 'm-grey-300',
      themeMap: ['#999', '#666'],
    },
    {
      id: 'm-blue',
      themeMap: ['#4690df', '#44aaff'],
    },
    {
      id: 'm-red-dark',
      themeMap: ['#c62828', '#e57373'],
    },
    {
      id: 'm-amber-dark',
      themeMap: ['#ffa000', '#ffecb3'],
    },
    {
      id: 'm-green-dark',
      themeMap: ['#388e3c', '#8bc34a'],
    },
    {
      id: 'm-blue-grey-500',
      themeMap: ['#607d8b', '#607d8b'],
    },
  ];

  // ***********************************************************************************

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private themeService: ThemeService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.themeService.isDark$.subscribe(isDark => (this.isDark = isDark));

    this.graphDiv = document.getElementById('graphDiv');

    // TODO: make sure these outliers end up with proper m- prefix
    this.hoverInfoDiv = document.getElementById('hoverInfo');

    this.hoverInfoXDiv = document.getElementById('hoverInfo__x'); // Date
    this.hoverInfoYDiv = document.getElementById('hoverInfo__y'); // Value
    this.hoverInfoComparisonXyDiv = document.getElementById(
      'hoverInfo__comparisonXy'
    );

    this.setData();
    this.setLayout();
    this.drawGraph();

    // this.graphDiv
    //   .on('plotly_hover', function($event) {})
    //   .on('plotly_unhover', function($event) {});
  }

  // DATA /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

  setData() {
    this.segmentLength = this.segments[0].buckets.length;

    const globalSegmentSettings: any = {
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        width: 2,
        dash: 'solid',
      },
      marker: {
        size: this.defaultMarkerSize,
        opacity: this.defaultMarkerOpacity,
      },
      showlegend: false,
      hoverinfo: 'text',
      x: this.datesTemp,
    };

    this.segments.forEach((s, i) => {
      const segment = {
        ...globalSegmentSettings,
        line: {
          ...globalSegmentSettings.line,
          color: this.getColor(this.segmentColorIds[i]),
        },
        y: this.unpack(this.segments[i].buckets, 'value'),
      };

      this.data.push(segment);
    });

    if (this.segmentLength === 2) {
      this.data[1].line.dash = 'dot';
    }

    // -------------------------------------------
    // HOVER PREP: DATA-BASED --------------------
    // -------------------------------------------
    for (let i = 0; i < this.segmentLength; i++) {
      this.defaultMarkerOpacities[i] = this.defaultMarkerOpacity;

      this.hoverVertLines.shapes[i] = {
        type: 'line',
        layer: 'below',
        x0: i,
        y0: 0,
        x1: i,
        y1: 0,
        line: {
          color: this.getColor('m-grey-50-transparent'),
          width: 2,
        },
      };
    }
    this.hoverMarkerOpacities = this.defaultMarkerOpacities.slice(0);

    return this.data;
  }

  // LAYOUT /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
  setLayout() {
    this.layout = {
      // autosize: false,
      // width: 0,
      // height: 0,
      hovermode: 'x',
      paper_bgcolor: this.getColor('m-white'),
      plot_bgcolor: this.getColor('m-white'),
      font: {
        family: 'Roboto',
      },
      xaxis: {
        // type: 'date',
        tickformat: '',
        // tickformat: getDateTickFormat(),
        // tickmode: 'auto', //or array, linear
        // nticks: 3, //TODO, depends on this.segmentLength
        // tickvals, // TODO: lookup
        // ticktext: // TODO: lookup
        tickangle: -45,
        tickfont: {
          color: this.getColor('m-grey-130'),
        },
        showgrid: false,
        showline: true,
        linecolor: this.getColor('m-grey-300'),
        linewidth: 1, // 2
        zeroline: false,
        fixedrange: true,
        text: 'mycooltextX',
      },
      yaxis: {
        ticks: '',
        showgrid: true,
        gridcolor: this.getColor('m-grey-70'),
        zeroline: false,
        side: 'right',
        tickfont: {
          color: this.getColor('m-grey-130'),
        },
        fixedrange: true,
        text: 'mycooltextY',
      },
      margin: {
        t: 16,
        b: 64,
        l: 24,
        r: 16,
        pad: 16,
      },
      shapes: this.hoverVertLines.shapes,
    };

    return this.layout;
  }

  // UTILITY \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
  unpack(rows, key) {
    return rows.map(row => {
      if (key === 'date') {
        return row[key].slice(0, 10);
      } else {
        return row[key];
      }
    });
  }

  getDateTickFormat() {
    // TODO add the rest of them
    const timespanTickFormats = [
      { interval: 'day', tickFormat: '%m/%d' },
      { interval: 'month', tickFormat: '%d/%y' },
    ];
    const selectedInterval = 'monthly';
    return timespanTickFormats.find(t => t.interval === selectedInterval)
      .tickFormat;
  }

  getColor(colorId) {
    let colorCode = '#607d8b';
    if (this.palette.find(color => color.id === colorId)) {
      colorCode = this.palette.find(color => color.id === colorId).themeMap[
        +this.isDark
      ];
    }
    return colorCode;
  }

  updateGraph() {
    // TODO: add latest shapes and marker settings to the updates
    // THIS IS CAUSING A LOOP (MH)
    //const dataUpdate = this.setData();
    //const layoutUpdate = this.setLayout();

    // Plotly.update('graphDiv', dataUpdate, layoutUpdate);
  }

  // GRAPH /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
  drawGraph() {
    // // -------------------------------------------
    // // DRAW THE GRAPH ----------------------------
    // -------------------------------------------
  }

  setVertLineHeights() {
    this.hoverVertLines.shapes.forEach(shape => {
      shape.y0 = this.graphDiv.layout.yaxis.range[0];
      shape.y1 = this.graphDiv.layout.yaxis.range[1];
    });
  }

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // EVENT: HOVER ------------------------------
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  // Plotly.getPlotly().Fx.hover(...);

  onHover($event) {
    this.thisPoint = $event.points[0].pointIndex;
    this.hoverMarkerOpacities[this.thisPoint] = this.hoverMarkerOpacity;

    // SHOW VERTICAL LINE
    this.hoverVertLines.shapes[this.thisPoint].line.color = this.getColor(
      'm-grey-50'
    );
  }

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // EVENT: UNHOVER ----------------------------
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  onUnhover($event) {
    // HIDE VERTICAL LINE
    this.hoverVertLines.shapes[this.thisPoint].line.color = this.getColor(
      'm-grey-50-transparent'
    );

    // HIDE MARKER
    this.hoverInfoDiv.style.opacity = 0;
    this.hoverMarkerOpacities[this.thisPoint] = this.defaultMarkerOpacity;
  }

  // // TODO: reimplement bc plotly responsive config doesn't work
  // @HostListener('window:resize')
  // applyDimensions() {
  //   this.layout = this.setLayout();
  //   this.setVertLineHeights();
  //   // this.layout = {
  //   //   ...this.layout,
  //   //   width: this.graphDiv.nativeElement.clientWidth,
  //   //   height: this.graphDiv.nativeElement.clientHeight - 35,
  //   // };
  // }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
    this.updateGraph(); // Does this run every time a change is made to vm$ as well?
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
