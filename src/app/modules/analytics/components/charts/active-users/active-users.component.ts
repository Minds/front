import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { timespanOption } from '../timespanOption';
import { removeCurrentUnits } from '../../../util';

@Component({
  selector: 'm-analyticscharts__activeusers',
  template: `
    <div class="m-chart" #chartContainer>
      <div
        class="mdl-spinner mdl-js-spinner is-active"
        [mdl]
        *ngIf="inProgress"
      ></div>

      <m-graph
        [data]="data"
        [layout]="layout"
        *ngIf="!inProgress && !!data"
      ></m-graph>
    </div>
  `,
})
export class ActiveUsersChartComponent implements OnInit {
  @Input() total: boolean = false;
  @Output() loaded: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  timespan: timespanOption;

  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  @Input('timespan') set _timespan(value: timespanOption) {
    this.timespan = value;

    if (this.init) {
      this.getData();
    }
  }

  init: boolean = false;
  inProgress: boolean = false;
  data: any = null;

  layout: any = {
    width: 0,
    height: 0,
    title: '',
    font: {
      family: 'Roboto',
    },
    titlefont: {
      family: 'Roboto',
      size: 24,
      weight: 'bold',
    },
    xaxis: {
      type: '-',
    },
    yaxis: {
      type: 'log',
      dtick: 1,
    },
    margin: {
      t: 16,
      b: 32,
      l: 32,
    },
  };

  constructor(private client: Client) {}

  ngOnInit() {
    this.applyDimensions();
    this.getData();
    this.init = true;
  }

  async getData() {
    let url =
      'api/v2/analytics/' + (this.total ? 'totalpageviews' : 'activeusers');

    this.inProgress = true;

    try {
      const response: any = await this.client.get(url, {
        timespan: this.timespan,
      });
      const [data, current] = removeCurrentUnits(response.data);
      this.data = data;

      this.loaded.emit(current);
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
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
