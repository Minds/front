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
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AnalyticsDashboardService,
  Timespan as TimespanBase,
  Buckets,
} from '../../dashboard.service';

import * as Plotly from 'plotly.js';
import chartPalette from '../../chart-palette.default';
import { ThemeService } from '../../../../../common/services/theme.service';
import isMobileOrTablet from '../../../../../helpers/is-mobile-or-tablet';

interface TimespanExtended extends TimespanBase {
  xTickFormat?: string;
  datePipe?: string;
}
export { TimespanExtended as Timespan };

@Component({
  selector: 'm-analytics__chart',
  templateUrl: 'chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChartComponent implements OnDestroy, OnInit {
  @ViewChild('graphDiv', { static: true }) graphDiv;
  @ViewChild('hoverInfoDiv', { static: true }) hoverInfoDivEl: ElementRef;
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  isTouchDevice: boolean;
  init: boolean = false;

  hoverInfoDiv: any;
  hoverInfo: any = {};

  metricSubscription: Subscription;
  selectedMetric$ = this.analyticsService.metrics$.pipe(
    map(metrics => {
      return metrics.find(metric => metric.visualisation !== null);
    })
  );
  selectedMetric;

  timespansSubscription: Subscription;
  selectedTimespan;

  themeSubscription: Subscription;
  isDark: boolean = false;

  segments: Buckets[];
  isComparison: boolean = false;

  data = [];
  layout;
  config = {
    displayModeBar: false,
    // responsive: true,
  };

  pointsPerSegment = 1;
  hoverPoint: number;
  lineRange: Array<any>;
  newLineRange = true;

  markerFills;
  shapes = [];
  timespanFormats = [
    { interval: 'day', xTickFormat: '%m/%d', datePipe: 'EEE MMM d, y' },
    { interval: 'month', xTickFormat: '%m/%Y', datePipe: 'MMM y' },
  ];
  datePipe: string = this.timespanFormats[0].datePipe;
  xTickFormat: string = this.timespanFormats[0].xTickFormat;
  // yTickPrefix: string = '';
  yTickFormat: string = '';

  // ***********************************************************

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private themeService: ThemeService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isTouchDevice = isMobileOrTablet();
    this.hoverInfoDiv = this.hoverInfoDivEl.nativeElement;

    this.timespansSubscription = this.analyticsService.timespans$.subscribe(
      timespans => {
        this.selectedTimespan = timespans.find(
          timespan => timespan.selected === true
        );

        const timespanFormat =
          this.timespanFormats.find(
            t => t.interval === this.selectedTimespan.interval
          ) || this.timespanFormats[0];

        this.xTickFormat = timespanFormat.xTickFormat;
        this.datePipe = timespanFormat.datePipe;

        if (this.init) {
          this.layout.xaxis.tickformat = this.xTickFormat;
        }
        this.detectChanges();
      }
    );

    this.themeSubscription = this.themeService.isDark$.subscribe(isDark => {
      this.isDark = isDark;
      this.getData();
      this.getLayout();
      this.detectChanges();
    });
    this.metricSubscription = this.selectedMetric$.subscribe(metric => {
      this.init = false;
      this.selectedMetric = metric;
      if (metric.unit && metric.unit === 'usd') {
        this.yTickFormat = '$.2f';
      }
      try {
        this.initPlot();
      } catch (err) {
        console.log(err);
      }
      this.detectChanges();
    });
  }

  swapSegmentColors() {
    const tempPaletteItem = chartPalette.segmentColorIds[0];
    chartPalette.segmentColorIds[0] = chartPalette.segmentColorIds[1];
    chartPalette.segmentColorIds[1] = tempPaletteItem;
  }

  getMarkerFills() {
    this.markerFills = [];
    this.segments.forEach((segment, index) => {
      const segmentMarkerFills = [];
      for (let i = 0; i < this.pointsPerSegment; i++) {
        segmentMarkerFills[i] = this.getColor('m-white');
      }
      this.markerFills.push(segmentMarkerFills);
    });
  }

  initPlot() {
    this.segments = this.selectedMetric.visualisation.segments;
    if (this.segments.length === 2) {
      this.isComparison = true;

      // Reverse the segments so comparison line is layered behind current line
      this.segments.reverse();

      // Current line should be blue
      this.swapSegmentColors();
    }

    this.pointsPerSegment = this.segments[0].buckets.length;

    for (let i = 0; i < this.pointsPerSegment; i++) {
      this.shapes[i] = {
        type: 'line',
        layer: 'below',
        x0: this.segments[0].buckets[i].date,
        y0: 0,
        x1: this.segments[0].buckets[i].date,
        y1: 0,
        line: {
          color: 'rgba(0, 0, 0, 0)',
          width: 2,
        },
      };
    }

    this.getMarkerFills(); // change to set?
    this.getData();
    this.getLayout();
    this.init = true;

    this.detectChanges();
  }

  getData() {
    const globalSegmentSettings = {
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        width: 1,
        dash: 'solid',
      },
      marker: {
        size: 7,
      },
      showlegend: false,
      hoverinfo: 'text',
      x: this.unpack(this.segments[0].buckets, 'date'),
    };

    this.segments.forEach((s, i) => {
      const segment = {
        ...globalSegmentSettings,
        line: {
          ...globalSegmentSettings.line,
          color: this.getColor(chartPalette.segmentColorIds[i]),
        },
        marker: {
          ...globalSegmentSettings.marker,
          color: this.markerFills[i],
          line: {
            color: this.getColor(chartPalette.segmentColorIds[i]),
            width: 1,
          },
        },
        y: this.unpack(this.segments[i].buckets, 'value'),
      };

      this.data[i] = segment;
    });

    if (this.isComparison) {
      this.data[0].line.dash = 'dot';
    }
  }

  getLayout() {
    this.layout = {
      width: 0,
      height: 0,
      autoexpand: 'true',
      autosize: 'true',
      hovermode: 'x',
      paper_bgcolor: this.getColor('m-white'),
      plot_bgcolor: this.getColor('m-white'),
      font: {
        family: 'Roboto',
      },
      xaxis: {
        tickformat: this.xTickFormat,
        tickmode: 'array',
        tickson: 'labels',
        tickcolor: this.getColor('m-grey-130'),
        tickangle: -45,
        tickfont: {
          color: this.getColor('m-grey-130'),
        },
        showgrid: false,
        showline: true,
        linecolor: this.getColor('m-grey-300'),
        linewidth: 1,
        zeroline: false,
        fixedrange: true,
        // rangemode: 'nonnegative',
      },
      yaxis: {
        ticks: '',
        tickformat: this.yTickFormat,
        tickmode: 'array',
        tickson: 'labels',
        showgrid: true,
        gridcolor: this.getColor('m-grey-70'),
        zeroline: false,
        visible: true,
        side: 'right',
        tickfont: {
          color: this.getColor('m-grey-130'),
        },
        fixedrange: true,
        // rangemode: 'nonnegative',
      },
      margin: {
        t: 16,
        b: 80,
        l: 0,
        r: 80,
        pad: 16,
      },
      shapes: this.shapes,
    };
  }

  onHover($event) {
    this.hoverPoint = $event.points[0].pointIndex;
    this.addMarkerFill();
    this.showShape($event);
    this.positionHoverInfo($event);
    this.populateHoverInfo();
    this.hoverInfoDiv.style.opacity = 1;
    this.detectChanges();
  }

  onUnhover($event) {
    this.emptyMarkerFill();
    this.hideShape();
    this.hoverInfoDiv.style.opacity = 0;
    this.detectChanges();
  }

  onClick($event) {
    if (!this.isTouchDevice) {
      return;
    }
    // TODO: use this for non-hover devices
  }

  addMarkerFill() {
    this.data.forEach((segment, i) => {
      this.markerFills[i][this.hoverPoint] = this.getColor(
        chartPalette.segmentColorIds[i]
      );
    });
  }

  emptyMarkerFill() {
    this.data.forEach((segment, i) => {
      this.markerFills[i][this.hoverPoint] = this.getColor('m-white');
      segment.marker.color = this.markerFills[i];
    });
  }

  showShape($event) {
    const hoverLine = this.shapes[this.hoverPoint];
    // Without this, entire graph resizes on every hover
    if (this.newLineRange) {
      this.newLineRange = false;
      this.lineRange = $event.yaxes[0].range;
    }

    hoverLine.y0 = this.lineRange[0];
    hoverLine.y1 = this.lineRange[1] * 0.99;
    hoverLine.line.color = this.getColor('m-grey-70');
    this.layout.shapes = this.shapes;
  }

  hideShape() {
    this.shapes[this.hoverPoint].line.color = 'rgba(0, 0, 0, 0)';
    this.layout.shapes = this.shapes;
  }

  populateHoverInfo() {
    // TODO: format value strings here and remove ngSwitch from template?
    this.hoverInfo['date'] = this.segments[0].buckets[this.hoverPoint].date;
    this.hoverInfo['value'] =
      this.selectedMetric.unit !== 'usd'
        ? this.segments[0].buckets[this.hoverPoint].value
        : this.segments[0].buckets[this.hoverPoint].value / 100;

    if (this.isComparison && this.segments[1]) {
      this.hoverInfo['comparisonValue'] =
        this.selectedMetric.unit !== 'usd'
          ? this.segments[1].buckets[this.hoverPoint].value
          : this.segments[1].buckets[this.hoverPoint].value / 100;

      this.hoverInfo['comparisonDate'] = this.segments[1].buckets[
        this.hoverPoint
      ].date;
    }
  }

  positionHoverInfo($event) {
    let targetPoint = 0;
    if (this.isComparison) {
      targetPoint = 1;
    }
    const xAxis = $event.points[0].xaxis,
      yAxis = $event.points[0].yaxis,
      tooltipXDist = xAxis.d2p($event.points[targetPoint].x) + 16,
      tooltipYDist = yAxis.d2p($event.points[targetPoint].y) + 16;

    // if (this.hoverPoint < this.pointsPerSegment / 2) {
    this.hoverInfoDiv.style.top = tooltipYDist + yAxis._offset + 'px';
    this.hoverInfoDiv.style.left = tooltipXDist + xAxis._offset + 'px';

    console.log('-------------');
    console.log('this hoverPoint', this.hoverPoint);
    console.log('tooltipXDist', tooltipXDist);
    console.log('xAxis._offset', xAxis._offset);

    console.log('tooltipYDist', tooltipYDist);
    console.log('yAxis._offset', yAxis._offset);
    // } else {
    //   this.hoverInfoDiv.style.top = tooltipYDist + xAxis._offset + 'px';
    //   this.hoverInfoDiv.style.left = tooltipXDist + yAxis._offset + 'px';
    // }
  }

  @HostListener('window:resize')
  applyDimensions() {
    if (this.init) {
      this.layout = {
        ...this.layout,
        width: this.chartContainer.nativeElement.clientWidth - 32,
        height: this.chartContainer.nativeElement.clientHeight - 32,
      };
      this.newLineRange = true;
      this.detectChanges();
    }
  }

  // * UTILITY -----------------------------------

  unpack(rows, key) {
    return rows.map(row => {
      if (key === 'date') {
        return row[key].slice(0, 10);
      } else if (this.selectedMetric.unit === 'usd') {
        return row[key] / 100;
      } else {
        return row[key];
      }
    });
  }

  getColor(colorId) {
    const palette = chartPalette.themeMaps;
    let colorCode = '#607d8b';

    if (palette.find(color => color.id === colorId)) {
      colorCode = palette.find(color => color.id === colorId).themeMap[
        +this.isDark
      ];
    }
    return colorCode;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.metricSubscription.unsubscribe();
    this.timespansSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
}
