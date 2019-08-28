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
  selector: 'm-analyticscharts__withdraw',
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
export class WithdrawChartComponent implements OnInit {
  @Output() loaded: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  timespan: timespanOption;
  init: boolean = false;
  inProgress: boolean = false;
  data: any;

  layout: any = {
    width: 0,
    height: 0,
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

  @Input('timespan') set _timespan(value: timespanOption) {
    this.timespan = value;
    if (this.init) {
      this.getData();
    }
  }

  constructor(private client: Client) {}

  ngOnInit() {
    this.applyDimensions();
    this.getData();
    this.init = true;
  }

  async getData() {
    const response: any = await this.client.get(`api/v2/analytics/withdraw`, {
      timespan: this.timespan,
    });
    const [data, current] = removeCurrentUnits(response.data);
    this.data = data;

    this.loaded.emit(current);
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
