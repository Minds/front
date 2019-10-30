import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  HostListener,
  // ChangeDetectionStrategy,
  // ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import chartPalette from './chart-palette.default';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';

@Component({
  selector: 'm-chartV2',
  templateUrl: './chart-v2.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartV2Component implements OnInit, OnDestroy {
  @ViewChild('hoverInfoDiv', { static: true }) hoverInfoDivEl: ElementRef;
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  @Input() settings;
  @Input() segments;
  @Input() layout;
  @Input() config;
  @Input() isMiniChart: boolean = false;
  @Input() isComparison: boolean = false;
  @Input() showHoverInfo: boolean = true;

  @Output() hovering: EventEmitter<any> = new EventEmitter();

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
      ...{
        width: 0,
        height: 0,
        autoexpand: 'true',
        autosize: 'true',
        hovermode: 'x',
      },
    };
  }

  init = false;
  isTouchDevice: boolean;

  hoverInfoDiv: any;

  themeSubscription: Subscription;
  isDark = false;

  pointsPerSegment: number;
  hoverPoint: number;
  lineRange: Array<any>;
  newLineRange = true;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.isTouchDevice = isMobileOrTablet();
    this.hoverInfoDiv = this.hoverInfoDivEl.nativeElement;

    this.themeSubscription = this.themeService.isDark$.subscribe(isDark => {
      this.isDark = isDark;
      if (this.init) {
        // this.setData();
        // this.setLayout();
      }
      // this.detectChanges();
    });
  }

  // * PREPARE PLOT -----------------------------

  // * EVENTS -----------------------------------
  // whenTheEventOccurs() {
  //   this.hovering.emit({hoverPoint:this.hoverPoint});
  //   }

  onHover($event) {
    this.hoverPoint = $event.points[0].pointIndex;
    this.hovering.emit({ hoverPoint: this.hoverPoint });
    // this.addMarkerFill();
    // this.showShape($event);
    // this.positionHoverInfo($event);
    // this.populateHoverInfo();
    this.hoverInfoDiv.style.opacity = 1;
    // this.detectChanges();
  }

  onUnhover($event) {
    // this.emptyMarkerFill();
    // this.hideShape();
    this.hoverInfoDiv.style.opacity = 0;
    // this.detectChanges();
  }

  onClick($event) {
    // if (!this.isTouchDevice) {
    //   return;
    // }
  }

  // addMarkerFill() {
  //   this.data.forEach((segment, i) => {
  //     this.markerFills[i][this.hoverPoint] = this.getColor(
  //       chartPalette.segmentColorIds[i]
  //     );
  //   });
  // }

  // emptyMarkerFill() {
  //   this.data.forEach((segment, i) => {
  //     this.markerFills[i][this.hoverPoint] = this.getColor('m-white');
  //     segment.marker.color = this.markerFills[i];
  //   });
  // }

  // showShape($event) {
  //   const hoverLine = this.shapes[this.hoverPoint];
  //   // Without this, entire graph resizes on every hover
  //   if (this.newLineRange) {
  //     this.newLineRange = false;
  //     this.lineRange = $event.yaxes[0].range;
  //   }

  //   hoverLine.y0 = this.lineRange[0];
  //   hoverLine.y1 = this.lineRange[1] * 0.99;
  //   hoverLine.line.color = this.getColor('m-grey-70');
  //   this.layout.shapes = this.shapes;
  // }

  // hideShape() {
  //   this.shapes[this.hoverPoint].line.color = 'rgba(0, 0, 0, 0)';
  //   this.layout.shapes = this.shapes;
  // }

  // populateHoverInfo() {
  //   const pt = this.isComparison ? 1 : 0;
  //   // TODO: format value strings here and remove ngSwitch from template?
  //   this.hoverInfo['date'] = this.segments[pt].buckets[this.hoverPoint].date;
  //   this.hoverInfo['value'] =
  //     this.selectedMetric.unit !== 'usd'
  //       ? this.segments[pt].buckets[this.hoverPoint].value
  //       : this.segments[pt].buckets[this.hoverPoint].value / 100;

  //   if (this.isComparison && this.segments[1]) {
  //     this.hoverInfo['comparisonValue'] =
  //       this.selectedMetric.unit !== 'usd'
  //         ? this.segments[0].buckets[this.hoverPoint].value
  //         : this.segments[0].buckets[this.hoverPoint].value / 100;

  //     this.hoverInfo['comparisonDate'] = this.segments[0].buckets[
  //       this.hoverPoint
  //     ].date;
  //   }
  // }

  // positionHoverInfo($event) {
  //   const pad = 16,
  //     pt = this.isComparison ? 1 : 0,
  //     xAxis = $event.points[pt].xaxis,
  //     yAxis = $event.points[pt].yaxis,
  //     pointXDist = xAxis.d2p($event.points[pt].x) + xAxis._offset,
  //     pointYDist = yAxis.d2p($event.points[pt].y) + yAxis._offset,
  //     plotRect = document
  //       .querySelector('.js-plotly-plot')
  //       .getBoundingClientRect(),
  //     hoverInfoRect = this.hoverInfoDiv.getBoundingClientRect();

  //   if (pointYDist < plotRect.height / 2) {
  //     // If point is in top half of plot, hoverinfo should go beneath it
  //     this.hoverInfoDiv.style.top = pointYDist + pad + 'px';
  //   } else {
  //     this.hoverInfoDiv.style.top =
  //       pointYDist - pad - hoverInfoRect.height + 'px';
  //   }

  //   if (pointXDist < plotRect.width / 2) {
  //     // If point is in left half of plot, hoverinfo should go on the right
  //     this.hoverInfoDiv.style.left = pointXDist + pad + 'px';
  //   } else {
  //     this.hoverInfoDiv.style.left =
  //       pointXDist - pad - hoverInfoRect.width + 'px';
  //   }
  // }

  @HostListener('window:resize')
  applyDimensions() {
    if (this.init) {
      this.layout.width = this.chartContainer.nativeElement.clientWidth;
      this.layout.height = this.chartContainer.nativeElement.clientHeight;

      this.newLineRange = true;
      // this.detectChanges();
    }
  }

  // * UTILITY -----------------------------------

  // unpack(rows, key) {
  //   return rows.map(row => {
  //     if (key === 'date') {
  //       return row[key].slice(0, 10);
  //     } else if (this.selectedMetric.unit === 'usd') {
  //       return row[key] / 100;
  //     } else {
  //       return row[key];
  //     }
  //   });
  // }

  // getColor(colorId) {
  //   const palette = chartPalette.themeMaps;
  //   let colorCode = '#607d8b';

  //   if (palette.find(color => color.id === colorId)) {
  //     colorCode = palette.find(color => color.id === colorId).themeMap[
  //       +this.isDark
  //     ];
  //   }
  //   return colorCode;
  // }

  // swapSegmentColors() {
  //   const tempPaletteItem = chartPalette.segmentColorIds[0];
  //   chartPalette.segmentColorIds[0] = chartPalette.segmentColorIds[1];
  //   chartPalette.segmentColorIds[1] = tempPaletteItem;
  // }

  // detectChanges() {
  //   this.cd.markForCheck();
  //   this.cd.detectChanges();
  // }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
