// Working version: https://codepen.io/omadrid/pen/NWKZYrV?editors=0010

import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AnalyticsDashboardService,
  Timespan,
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
  @ViewChild('graphDiv', { static: true }) graphDivEl: ElementRef;
  @ViewChild('hoverInfoDiv', { static: true }) hoverInfoDivEl: ElementRef;

  graphDiv: any;
  hoverInfoDiv: any;
  hoverInfo: any = {};

  metricSubscription: Subscription;
  selectedMetric$ = this.analyticsService.metrics$.pipe(
    map(metrics => {
      return metrics.find(metric => metric.visualisation !== null);
    })
  );
  selectedMetric;

  timespanSubscription: Subscription;
  timespan: string;

  timespansSubscription: Subscription;
  timespans: Timespan[];

  themeSubscription: Subscription;
  isDark: boolean = false;

  segments: Buckets[];
  isComparison: boolean = false;

  data: Array<any> = [];
  layout: any;
  config: any = {
    displayModeBar: false,
    // responsive: true,
  };

  segmentLength: number;
  hoverPoint: number;

  markerOpacities: Array<number> = [];
  shapes: Array<any> = [];

  datePipe: string = 'EEE MMM d YYYY';
  tickFormat: string = '%m/%d';

  // ***********************************************************************************

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private themeService: ThemeService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.graphDiv = this.graphDivEl.nativeElement;
    this.hoverInfoDiv = this.hoverInfoDivEl.nativeElement;

    this.metricSubscription = this.selectedMetric$.subscribe(metric => {
      this.selectedMetric = metric;
      try {
        this.initPlot();
      } catch (err) {
        console.log(err);
      }
    });

    this.timespanSubscription = this.analyticsService.timespan$.subscribe(
      timespan => {
        this.timespan = timespan;

        // const selectedInterval = this.timespans.find(
        //   ts => ts.id === this.timespan
        // ).interval;

        // const timespanFormats = [
        //   { interval: 'day', tickFormat: '%m/%d', datePipe: 'EEE MMM d YYYY' },
        //   { interval: 'month', tickFormat: '%m/%y', datePipe: 'MMM YYYY' },
        // ];
        // const timespanFormat =
        //   timespanFormats.find(t => t.interval === selectedInterval) ||
        //   timespanFormats[0];

        // this.tickFormat = timespanFormat.tickFormat;
        // this.datePipe = timespanFormat.datePipe;

        // console.log(this.tickFormat);
        this.detectChanges();
      }
    );

    this.timespansSubscription = this.analyticsService.timespans$.subscribe(
      timespans => {
        this.timespans = timespans;
        this.detectChanges();
      }
    );

    this.themeSubscription = this.themeService.isDark$.subscribe(isDark => {
      this.isDark = isDark;

      // this.relayout(this.getLayout());
      // this.restyle(this.getData());
      this.detectChanges();
    });
  }

  initPlot() {
    this.data = [];
    this.shapes = [];
    this.markerOpacities = [];
    this.segments = this.selectedMetric.visualisation.segments;
    this.segmentLength = this.segments[0].buckets.length;

    for (let i = 0; i < this.segmentLength; i++) {
      this.markerOpacities[i] = 0;

      this.shapes[i] = {
        type: 'line',
        layer: 'below',
        x0: this.segments[0].buckets[i].date,
        y0: 0,
        x1: this.segments[0].buckets[i].date,
        y1: 0,
        line: {
          color: this.getColor('m-transparent'),
          width: 2,
        },
      };
    }
    this.data = this.getData();
    this.layout = this.getLayout();

    Plotly.newPlot('graphDiv', this.data, this.layout, this.config);
    this.setLineHeights();

    this.graphDiv.on('plotly_hover', $event => {
      this.onHover($event);
    });

    this.graphDiv.on('plotly_unhover', $event => {
      this.onUnhover($event);
    });

    this.detectChanges();
  }
  // ----------------------------------------------
  // EVENT: HOVER
  // ----------------------------------------------
  onHover($event) {
    // TODO: return if filters.component filter is expanded
    this.hoverPoint = $event.points[0].pointIndex;
    this.showMarkers();
    this.showShapes();
    this.positionHoverInfo($event);
    this.populateHoverInfo();
    this.showHoverInfo();

    this.detectChanges();
  }

  // ----------------------------------------------
  // EVENT: UNHOVER
  // ----------------------------------------------
  onUnhover($event) {
    this.hideMarkers();
    this.hideShapes();
    this.hideHoverInfo();
  }

  showMarkers() {
    this.markerOpacities[this.hoverPoint] = 1;

    Plotly.restyle(this.graphDiv, {
      marker: { opacity: this.markerOpacities },
    });
  }

  hideMarkers() {
    this.markerOpacities[this.hoverPoint] = 0;
    Plotly.restyle(this.graphDiv, {
      marker: { opacity: this.markerOpacities },
    });
  }

  showShapes() {
    this.layout.shapes[this.hoverPoint].line.color = this.getColor('m-grey-50');

    this.relayout(this.layout);
  }

  hideShapes() {
    // HIDE VERTICAL LINE
    this.layout.shapes[this.hoverPoint].line.color = this.getColor(
      'm-transparent'
    );
    this.relayout(this.layout);
  }

  populateHoverInfo() {
    // TODO: format value strings here and remove ngSwitch from template?
    this.hoverInfo['date'] = this.segments[0].buckets[this.hoverPoint].date;
    this.hoverInfo['value'] = this.segments[0].buckets[this.hoverPoint].value;

    if (this.isComparison) {
      this.hoverInfo['comparisonValue'] = this.segments[1].buckets[
        this.hoverPoint
      ].value;

      this.hoverInfo['comparisonDate'] = this.segments[1].buckets[
        this.hoverPoint
      ].date;
    }
  }

  positionHoverInfo($event) {
    const xAxis = $event.points[0].xaxis,
      yAxis = $event.points[0].yaxis,
      tooltipXDist = xAxis.d2p($event.points[0].x) + 16,
      tooltipYDist = yAxis.d2p($event.points[0].y) + 16;

    // if (this.hoverPoint < this.segmentLength / 2) {
    this.hoverInfoDiv.style.top = tooltipYDist + yAxis._offset + 'px';
    this.hoverInfoDiv.style.left = tooltipXDist + xAxis._offset + 'px';
    // } else {
    //   // TODO move the second half of tooltips to the left of points
    //   // TODO also shift down/up if with x% of rangeMin/rangeMax???
    //   this.hoverInfoDiv.style.top = tooltipYDist + xAxis._offset + 'px';
    //   this.hoverInfoDiv.style.left = tooltipXDist + yAxis._offset + 'px';
    // }
  }

  showHoverInfo() {
    this.hoverInfoDiv.style.opacity = 1;
  }

  hideHoverInfo() {
    this.hoverInfoDiv.style.opacity = 0;
  }
  // UTILITY \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
  update(data, layout) {
    this.data = data;
    this.layout = layout;
    Plotly.update('graphDiv', data, layout);
  }

  restyle(data) {
    this.data = data;
    Plotly.restyle(this.graphDiv, data);
    this.detectChanges();
  }

  relayout(layout) {
    this.layout = layout;
    Plotly.relayout(this.graphDiv, layout);
    this.detectChanges();
  }

  unpack(rows, key) {
    return rows.map(row => {
      if (key === 'date') {
        return row[key].slice(0, 10);
      } else {
        return row[key];
      }
    });
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

    console.log('setLineHeights()');
    this.relayout(this.getLayout());
  }

  getData() {
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

    // COLORS FOR UP TO 6 SEGMENTS
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

      this.data[i] = segment;
    });

    if (this.segments.length === 2) {
      this.isComparison = true;
      this.data[1].line.dash = 'dot';
    }
    return this.data;
  }

  getLayout() {
    return {
      width: 0,
      height: 0,
      hovermode: 'x',
      paper_bgcolor: this.getColor('m-white'),
      plot_bgcolor: this.getColor('m-white'),
      font: {
        family: 'Roboto',
      },
      xaxis: {
        // type: 'date',
        // tickformat: '',
        tickformat: this.tickFormat,
        tickmode: 'array', //or array, linear
        nticks: this.segmentLength,
        // tickvals, // TODO: lookup
        ticks: 'outside',
        tickson: 'labels',
        tickcolor: this.getColor('m-grey-130'),
        tickangle: -45,
        tickfont: {
          color: this.getColor('m-grey-300'),
        },
        showgrid: false,
        showline: true,
        linecolor: this.getColor('m-grey-300'),
        linewidth: 1,
        zeroline: false,
        fixedrange: true,
        // range: [
        //   this.segments[0].buckets[0].date.slice(0, 10),
        //   this.segments[0].buckets[this.segmentLength - 1].date.slice(0, 10),
        // ],
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
      },
      margin: {
        t: 16,
        b: 80,
        l: 24,
        r: 16,
        pad: 16,
      },
      shapes: this.shapes,
    };
  }

  @HostListener('window:resize')
  applyDimensions() {
    this.layout = {
      ...this.layout,
      width: this.graphDiv.clientWidth - 16,
      height: this.graphDiv.clientHeight - 16,
    };
    this.setLineHeights();
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.metricSubscription.unsubscribe();
    this.timespanSubscription.unsubscribe();
    this.timespansSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
}
