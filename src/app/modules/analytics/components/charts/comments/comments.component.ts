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
import { MindsUser } from '../../../../../interfaces/entities';
import { timespanOption } from '../timespanOption';
import { removeCurrentUnits } from '../../../util';

@Component({
  selector: 'm-analyticscharts__comments',
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
export class CommentsChartComponent implements OnInit {
  @Input() user: MindsUser;
  @Output() loaded: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  init: boolean = false;
  timespan: timespanOption;
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
    let url = 'api/v2/analytics/comments';

    const opts = { timespan: this.timespan };

    if (this.user) {
      opts['userGuid'] = this.user.guid;
    }

    this.inProgress = true;

    try {
      const response: any = await this.client.get(url, opts);
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
