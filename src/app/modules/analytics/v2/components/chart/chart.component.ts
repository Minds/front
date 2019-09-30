import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'm-analytics__chart',
  templateUrl: 'chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChartComponent implements OnInit {
  response = this.analyticsService.getData();
  visualisation: Visualisation;
  vm$: Observable<UserState> = this.analyticsService.vm$;

  data4 = [
    {
      x: ['08/30', '08/31', '09/01', '09/02', '09/03'],
      y: [4, 9, 16, 17, 15],
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        color: '#4690df',
        width: 2,
      },
      marker: {
        size: 1,
      },
      showlegend: false,
      hovertemplate:
        'Fri Aug 30th 2019<br>' +
        '<b class="test">750 Active Users</b><br>' +
        '<span>vs 450 Fri August 23rd</span>' +
        '<extra></extra>',
    },
    {
      x: ['08/30', '08/31', '09/01', '09/02', '09/03'],
      y: [3, 7, 14, 18, 16],
      type: 'scatter',
      mode: 'line',
      line: {
        color: '#ccc',
        width: 2,
        dash: 'dot',
      },
      marker: {
        size: 1,
      },
      showlegend: false,
      hovertemplate: '<extra></extra>',
    },
  ];

  // *******************************************

  layout: any = {
    width: 0,
    height: 0,
    title: '',
    hovermode: 'closest', // or False, for historical line
    hoverlabel: { bgcolor: '#eee' },
    font: {
      family: 'Roboto',
    },
    titlefont: {
      family: 'Roboto',
      size: 24,
      weight: 'bold',
    },
    xaxis: {
      // dtick: 1, //comparison_interval(1, 7, 28, etc.)
      automargin: true,
      tickangle: -45,
      tickfont: {
        color: '#ccc',
      },
      // zeroline: false,
      showgrid: false,
    },
    yaxis: {
      automargin: true,
      ticks: '',
      zeroline: true,
      zerolinecolor: '#666',
      showticklabels: false,
    },
    margin: {
      t: 16,
      b: 32,
      l: 16,
      r: 16,
    },
  };

  // *******************************************

  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    this.applyDimensions();

    // this.visualisation = this.response.metrics.find(
    //   metric => metric.id === this.vm$.metric
    // ).visualisation;
  }

  @HostListener('window:resize')
  applyDimensions() {
    this.layout = {
      ...this.layout,
      width: this.chartContainer.nativeElement.clientWidth,
      height: this.chartContainer.nativeElement.clientHeight - 35,
    };
  }
}
