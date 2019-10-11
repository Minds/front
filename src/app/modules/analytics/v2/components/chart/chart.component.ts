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
import { map } from 'rxjs/operators';
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
  Buckets,
} from '../../dashboard.service';

import * as Plotly from 'plotly.js';
import { Config, Data, Layout } from 'plotly.js'; // TODO: remove this?
import chartPalette from '../../chart-palette.default';
import { ThemeService } from '../../../../../common/services/theme.service';

@Component({
  selector: 'm-analytics__chart',
  templateUrl: 'chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChartComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  selectedMetric$ = this.analyticsService.metrics$.pipe(
    map(metrics => {
      console.log(
        metrics,
        metrics.find(metric => metric.visualisation !== null)
      );
      return metrics.find(metric => metric.visualisation !== null);
    })
  );
  selectedMetric;

  themeSubscription: Subscription;
  isDark: boolean = false;

  segments: Buckets[];

  timespan: Timespan;

  data: Array<any> = [];
  layout: any;
  config: any = {
    displayModeBar: false,
    responsive: true,
  };

  segmentLength: number;
  hoverPoint: number;

  markerOpacities: Array<number> = [];
  shapes = [];

  graphDiv: any;
  hoverInfoDiv: any;

  // TODO: get these from parent instead
  hoverInfoXDiv: any;
  hoverInfoYDiv: any;
  hoverInfoComparisonXyDiv: any;

  hoverInfoTextX: string;
  hoverInfoTextY: string;
  hoverInfoTextComparisonXy: string;

  // ***********************************************************************************

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private themeService: ThemeService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.selectedMetric$.subscribe(metric => {
      this.selectedMetric = metric;
      try {
        this.updateGraph();
      } catch (err) {
        console.log(err);
      }
    });

    this.themeSubscription = this.themeService.isDark$.subscribe(isDark => {
      this.isDark = isDark;
      // TODO: relayout and restyle when theme changes
    });

    this.graphDiv = document.getElementById('graphDiv');

    // TODO: make sure these outliers end up with proper m- prefix
    this.hoverInfoDiv = document.getElementById('hoverInfo');

    this.hoverInfoXDiv = document.getElementById('hoverInfo__x'); // Date
    this.hoverInfoYDiv = document.getElementById('hoverInfo__y'); // Value
    this.hoverInfoComparisonXyDiv = document.getElementById(
      'hoverInfo__comparisonXy'
    );
  }

  updateGraph() {
    this.data = [];
    this.shapes = [];
    this.markerOpacities = [];
    this.segments = this.selectedMetric.visualisation.segments;

    console.log('segments', this.segments);
    this.segmentLength = this.segments[0].buckets.length;

    // ----------------------------------------------
    for (let i = 0; i < this.segmentLength; i++) {
      this.markerOpacities[i] = 0;

      this.shapes[i] = {
        type: 'line',
        layer: 'below',
        x0: this.segments[0].buckets[i].date.slice(0, 10),
        y0: 0, // this should be rendered graph y min
        x1: this.segments[0].buckets[i].date.slice(0, 10),
        y1: this.segments[0].buckets[i].value, // should be rendered graph y max
        line: {
          color: this.getColor('m-transparent'),
          width: 2,
        },
      };
    }

    // ----------------------------------------------
    // LAYOUT

    this.layout = {
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
      shapes: this.shapes,
    };

    // ----------------------------------------------
    // DATA

    const globalSegmentSettings: any = {
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        width: 2,
        dash: 'solid',
      },
      marker: {
        size: 10,
        opacity: 0,
      },
      showlegend: false,
      hoverinfo: 'text',
      x: this.unpack(this.segments[0].buckets, 'date'),
    };

    // ----------------------------------------------
    const segmentColorIds = [
      'm-blue',
      'm-grey-160',
      'm-amber-dark',
      'm-green-dark',
      'm-red-dark',
      'm-blue-grey-500',
    ];

    this.segments.forEach((s, i) => {
      const segment = {
        ...globalSegmentSettings,
        line: {
          ...globalSegmentSettings.line,
          color: this.getColor(segmentColorIds[i]),
        },
        y: this.unpack(this.segments[i].buckets, 'value'),
      };

      this.data.push(segment);
    });

    if (this.segmentLength === 2 && this.data[1]) {
      this.data[1].line.dash = 'dot';
    }

    this.cd.markForCheck();
    this.cd.detectChanges();

    //Plotly.purge('graphDiv');
    //Plotly.newPlot('graphDiv', this.data, this.layout, { displayModeBar: false });
  }

  restyle() {
    const dataUpdate = this.data;
    // Plotly.restyle('graphDiv', dataUpdate);
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  relayout() {
    // const layoutUpdate = this.layout;
    //Plotly.relayout('graphDiv', layoutUpdate);
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  // drawGraph() {}

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
    const palette = chartPalette;
    let colorCode = '#607d8b';

    if (palette.find(color => color.id === colorId)) {
      colorCode = palette.find(color => color.id === colorId).themeMap[
        +this.isDark
      ];
    }
    return colorCode;
  }

  setLineHeights() {
    this.shapes.forEach(shape => {
      shape.y0 = this.graphDiv.layout.yaxis.range[0];
      shape.y1 = this.graphDiv.layout.yaxis.range[1];
    });
  }

  onHover($event) {
    // console.log('hovering');
    // console.log($event);
    this.hoverPoint = $event.points[0].pointIndex;

    // console.log(this.shapes);
    this.markerOpacities[this.hoverPoint] = 1;

    // SHOW VERTICAL LINE
    this.shapes[this.hoverPoint].line.color = this.getColor('m-grey-50');
    this.layout.shapes[this.hoverPoint].line.color = this.getColor('m-grey-50');

    this.relayout();
  }

  onUnhover($event) {
    // HIDE VERTICAL LINE
    this.shapes[this.hoverPoint].line.color = this.getColor('m-transparent');

    // HIDE MARKER
    this.hoverInfoDiv.style.opacity = 0;
    this.markerOpacities[this.hoverPoint] = 0;

    this.relayout();
  }

  // afterPlot($event) {
  //   console.log('afterplot');
  //   this.setLineHeights();
  //   this.relayout();
  // }

  @HostListener('window:resize')
  applyDimensions() {
    // this.layout = this.relayout();
    // this.setLineHeights();
    // this.layout = {
    //   ...this.layout,
    //   width: this.graphDiv.nativeElement.clientWidth,
    //   height: this.graphDiv.nativeElement.clientHeight - 35,
    // };
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
}
