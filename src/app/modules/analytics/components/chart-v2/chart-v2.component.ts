import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostBinding,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../common/services/theme.service';
import chartPalette from './chart-palette.default';
import isMobileOrTablet from '../../../../helpers/is-mobile-or-tablet';

@Component({
  selector: 'm-chartV2',
  templateUrl: './chart-v2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartV2Component implements OnInit, OnDestroy {
  @ViewChild('hoverInfoDiv', { static: true }) hoverInfoDivEl: ElementRef;
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  @Input() rawData;
  @Input() interval;
  @Input() isMini: boolean = false;
  @Input() showHoverInfo: boolean = true;

  @HostBinding('class') get checkIsMini() {
    if (!this.isMini) {
      return '';
    }
    return 'isMini';
  }

  init = false;
  isTouchDevice: boolean;

  themeSubscription: Subscription;
  isDark = false;

  data = [];
  layout;
  config = {
    displayModeBar: false,
  };

  segments;
  isComparison = false;
  pointsPerSegment: number;
  markerFills;
  shapes = [];

  datePipe: string = 'EEE MMM d, y';
  xTickFormat: string = '%m/%d';
  yTickFormat: string = '';

  hoverPoint: number;
  hoverInfoDiv: any;
  hoverInfo: any = {};
  lineRange: Array<any>;
  newLineRange = true;

  constructor(
    private themeService: ThemeService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isTouchDevice = isMobileOrTablet();
    this.hoverInfoDiv = this.hoverInfoDivEl.nativeElement;
    this.segments = this.isMini
      ? this.rawData.visualisation.segments.slice(0, 1)
      : this.rawData.visualisation.segments;
    if (this.segments.length === 2) {
      // this.isComparison = true;
      // Reverse the segments so comparison line is layered behind current line
      // this.segments.reverse();
      // Current line should be blue, not grey
      // this.swapSegmentColors();
      this.detectChanges();
    }
    this.themeSubscription = this.themeService.isDark$.subscribe(isDark => {
      this.isDark = isDark;
      if (this.init) {
        this.setData();
        this.setLayout();
      }
      this.detectChanges();
    });

    this.initPlot();
  }

  swapSegmentColors() {
    const tempPaletteItem = chartPalette.segmentColorIds[0];
    chartPalette.segmentColorIds[0] = chartPalette.segmentColorIds[1];
    chartPalette.segmentColorIds[1] = tempPaletteItem;
  }

  // * PREPARE PLOT -----------------------------
  initPlot() {
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

    this.setData();
    this.setLayout();
    this.init = true;

    this.detectChanges();
  }

  setData() {
    this.markerFills = [];
    this.segments.forEach((segment, index) => {
      const segmentMarkerFills = [];
      for (let i = 0; i < this.pointsPerSegment; i++) {
        segmentMarkerFills[i] = this.getColor(
          chartPalette.segmentColorIds[index]
        );
      }
      this.markerFills.push(segmentMarkerFills);
    });

    const globalSegmentSettings = {
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        width: 1,
        dash: 'solid',
      },
      marker: {
        size: this.isMini ? 5 : 7,
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

      if (this.segments[i].comparison) {
        segment.line.dash = 'dot';
      }

      this.data[i] = segment;
    });
  }

  setLayout() {
    const timespanFormats = [
      { interval: 'day', xTickFormat: '%m/%d', datePipe: 'EEE MMM d, y' },
      { interval: 'month', xTickFormat: '%m/%Y', datePipe: 'MMM y' },
    ];
    const timespanFormat =
      timespanFormats.find(t => t.interval === this.interval) ||
      timespanFormats[0];

    this.xTickFormat = timespanFormat.xTickFormat;
    this.datePipe = timespanFormat.datePipe;
    if (this.init) {
      this.layout.xaxis.tickformat = this.xTickFormat;
    }

    if (this.rawData.unit && this.rawData.unit === 'usd') {
      this.yTickFormat = '$.2f';
    }

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
      },
      yaxis: {
        ticks: '',
        tickformat: this.yTickFormat,
        tickmode: 'array',
        tickson: 'labels',
        showgrid: !this.isMini,
        gridcolor: this.getColor('m-grey-70'),
        zeroline: false,
        visible: true,
        side: 'right',
        tickfont: {
          color: this.getColor('m-grey-130'),
        },
        fixedrange: true,
      },
      margin: {
        t: this.isMini ? 0 : 16,
        b: this.isMini ? 0 : 80,
        l: 0,
        r: this.isMini ? 0 : 80,
        pad: 16,
      },
      shapes: this.shapes,
    };
  }
  // * EVENTS -----------------------------------

  onHover($event) {
    this.hoverPoint = $event.points[0].pointIndex;
    this.emptyMarkerFill();
    if (!this.isMini) {
      this.showShape($event);
    }
    if (this.showHoverInfo) {
      this.positionHoverInfo($event);
      this.populateHoverInfo();
      this.hoverInfoDiv.style.opacity = 1;
    }
    this.detectChanges();
  }

  onUnhover($event) {
    this.addMarkerFill();
    this.hideShape();
    this.hoverInfoDiv.style.opacity = 0;
    this.detectChanges();
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
    // Without this, entire graph shrinks on every hover
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
      this.rawData.unit !== 'usd'
        ? this.segments[0].buckets[this.hoverPoint].value
        : this.segments[0].buckets[this.hoverPoint].value / 100;

    this.hoverInfo['values'] = [];

    for (const pt in this.segments) {
      const segment = this.segments[pt];
      this.hoverInfo['values'][pt] = {
        value:
          this.rawData.unit !== 'usd'
            ? segment.buckets[this.hoverPoint].value
            : segment.buckets[this.hoverPoint].value / 100,
        label: segment.label || this.rawData.label,
        color: this.getColor(chartPalette.segmentColorIds[pt]),
      };
    }

    // if (this.isComparison && this.segments[1]) {
    //   this.hoverInfo['comparisonValue'] =
    //     this.rawData.unit !== 'usd'
    //       ? this.segments[0].buckets[this.hoverPoint].value
    //       : this.segments[0].buckets[this.hoverPoint].value / 100;
    //
    //   this.hoverInfo['comparisonDate'] = this.segments[0].buckets[
    //     this.hoverPoint
    //   ].date;
    // }
  }

  positionHoverInfo($event) {
    const pt = this.isComparison ? 1 : 0,
      xAxis = $event.points[pt].xaxis,
      yAxis = $event.points[pt].yaxis,
      pointXDist = xAxis.d2p($event.points[pt].x) + xAxis._offset,
      pointYDist = yAxis.d2p($event.points[pt].y) + yAxis._offset,
      plotRect = document
        .querySelector('.js-plotly-plot')
        .getBoundingClientRect(),
      hoverInfoRect = this.hoverInfoDiv.getBoundingClientRect(),
      pad = this.isMini ? 4 : 16;

    if (this.isMini) {
      this.hoverInfoDiv.style.top = pointYDist - 2 + 'px';
    } else if (pointYDist < plotRect.height / 2) {
      this.hoverInfoDiv.style.top = pointYDist + pad + 'px';
    } else {
      this.hoverInfoDiv.style.top =
        pointYDist - pad - hoverInfoRect.height + 'px';
    }

    if (this.isMini) {
      this.hoverInfoDiv.style.left = pointXDist + pad + 'px';
      return;
    }

    if (pointXDist < plotRect.width / 2) {
      this.hoverInfoDiv.style.left = pointXDist + pad + 'px';
    } else {
      this.hoverInfoDiv.style.left =
        pointXDist - pad - hoverInfoRect.width + 'px';
    }
  }

  @HostListener('window:resize')
  applyDimensions() {
    if (this.init) {
      this.layout.width = this.chartContainer.nativeElement.clientWidth;
      this.layout.height = this.chartContainer.nativeElement.clientHeight;

      this.newLineRange = true;
      this.detectChanges();
    }
  }

  // * UTILITY -----------------------------------

  unpack(rows, key) {
    return rows.map(row => {
      if (key === 'date') {
        return row[key].slice(0, 10);
      } else if (this.rawData.unit && this.rawData.unit === 'usd') {
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
    this.themeSubscription.unsubscribe();
  }
}
