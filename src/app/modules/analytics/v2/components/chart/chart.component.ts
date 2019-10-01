import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  response = this.analyticsService.getData();
  visualisation: Visualisation;
  vm$: Observable<UserState> = this.analyticsService.vm$;

  isDark: boolean = false;
  themeSubscription: Subscription;

  // TODO: make these come from vm$  (or analyticsService.getVisualisation()?);
  x1: Array<any> = ['08/30', '08/31', '09/01', '09/02', '09/03'];
  y1: Array<any> = [4, 9, 16, 17, 15];
  y2: Array<any> = [3, 7, 14, 18, 16];
  // x2 would be the actual dates for y2

  analyticsPlot: any = {};
  hoverInfoTextX: string;
  hoverInfoTextY: string;
  hoverInfoTextComparisonXY: string;

  closestHoverPointPositionX: number = 0;
  closestHoverPointPositionY: number = 0;

  hoverStyles: any = {
    marker: {
      size: 6,
      // size: [40, 60, 80, 100],
    },
  };

  unHoverStyles: any = {
    marker: {
      size: 1,
    },
  };

  globalSegmentSettings: any = {
    type: 'scatter',
    mode: 'lines+markers',
    line: {
      width: 2,
      color: '#4690df',
    },
    marker: {
      size: 4,
    },
    showlegend: false,
    hoverinfo: 'text',
  };

  // segmentColors: string[] = ['#555', 'salmon', 'cadetblue', 'gold']; //TODO: add more colors from palette?

  // TODO: theme colors array for intra-Plotly styles

  responseData = [
    {
      ...this.globalSegmentSettings,
      x: this.x1,
      y: this.y1,
    },
    {
      ...this.globalSegmentSettings,
      line: { ...this.globalSegmentSettings, color: '#ccc', dash: 'dot' },
      x: this.x1,
      y: this.y2,
      hoverinfo: 'none', // nothing is displayed but event still fires
    },
  ];

  // ***********************************************************************************

  // layout: Layout = {
  layout: any = {
    width: 0,
    height: 0,
    // title: '',
    hovermode: 'closest',
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    font: {
      family: 'Roboto',
    },
    // titlefont: {
    //   family: 'Roboto',
    //   size: 24,
    // },
    xaxis: {
      // automargin: true,
      tickangle: -45,
      tickfont: {
        color: '#ccc',
      },
      showgrid: false,
      // gridcolor: 'white' // instead of false?
    },
    yaxis: {
      // automargin: true,
      ticks: '',
      showgrid: true,
      zeroline: true,
      zerolinecolor: '#222',
      // showticklabels: false,
      side: 'right',
      tickfont: {
        color: '#ccc',
      },
    },
    margin: {
      t: 16,
      b: 32,
      l: 16,
      r: 16,
    },
  };

  // ***********************************************************************************

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private themeService: ThemeService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.analyticsPlot = document.getElementById('chartContainer');

    // TODO: make sure these outliers end up with proper m- prefix
    const hoverInfo = document.getElementById('hoverInfo');
    const hoverInfoX = document.getElementById('hoverInfo__x'); // Date
    const hoverInfoY = document.getElementById('hoverInfo__y'); // Value
    const hoverInfoComparisonXy = document.getElementById(
      'hoverInfo__comparisonXy'
    );

    Plotly.plot('chartContainer', this.responseData, this.layout, {
      displayModeBar: false,
    });

    // ** HOVER *******************************************************
    this.analyticsPlot
      .on('plotly_hover', function(eventData) {
        hoverInfo.style.display = 'block';
        Plotly.restyle(this.analyticsPlot, this.hoverStyles, 0);

        this.hoverInfoXText = eventData.points.map(function(d) {
          return '' + d.x;
        });

        this.hoverInfoYText = eventData.points.map(function(d) {
          return d.y.toPrecision(3) + ' borks';
        });

        this.hoverInfoComparisonXyText = eventData.points.map(function(d) {
          // TODO: how best to connect current with comparison segment data
          return 'vs 700 Tues Oct 1st';
        });

        console.log(eventData);
        console.log(eventData.points[0].data.marker.size);
        eventData.points[0].data.marker.size = 4;
        console.log(eventData.points[0].data.marker.size);

        const xaxis = eventData.points[0].xaxis,
          yaxis = eventData.points[0].yaxis;

        eventData.points.forEach(function(p) {
          // note: 'l2p' means 'linear to pixel'
          console.log('pixel position', xaxis.l2p(p.x), yaxis.l2p(p.y));
          console.log('pixel position', xaxis.l2p(p.x), yaxis.l2p(p.y));
          this.closestHoverPointPositionX = xaxis.l2p(p.x);
          this.closestHoverPointPositionY = yaxis.l2p(p.x);
        });

        hoverInfoX.textContent = this.hoverInfoXText.join();
        hoverInfoY.textContent = this.hoverInfoYText.join();
        hoverInfoComparisonXy.textContent = this.hoverInfoComparisonXyText.join();
      })
      // ** UNHOVER *******************************************************
      .on('plotly_unhover', function(eventData) {
        hoverInfo.style.display = 'none';

        Plotly.restyle(this.analyticsPlot, this.unHoverStyles, 0);

        // eventData.xaxes[0].showline = true;
        // eventData.yaxes[0].showline = true;

        console.log(eventData);
        // this.hoverInfoX.textContent = '';
        // this.hoverInfoY.textContent = '';
        // this.hoverInfoComparisonXy.textContent = '';
      });

    this.themeService.isDark$.subscribe(isDark => (this.isDark = isDark));
  }

  // TODO: reimplement?
  // @HostListener('window:resize')
  // applyDimensions() {
  //   this.layout = {
  //     ...this.layout,
  //     width: this.chartContainer.nativeElement.clientWidth,
  //     height: this.chartContainer.nativeElement.clientHeight - 35,
  //   };
  // }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
    this.themeService.applyThemePreference();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
