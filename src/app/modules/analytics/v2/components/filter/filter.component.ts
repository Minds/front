import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
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
import isMobileOrTablet from '../../../../../helpers/is-mobile-or-tablet';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-analytics__filter',
  templateUrl: 'filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsFilterComponent implements OnInit {
  @Input() filter: Filter;
  @Input() dropUp: boolean = false;

  isMobile: boolean;
  expanded = false;
  options: Array<any> = [];
  selectedOption: Option;
  constructor(
    private analyticsService: AnalyticsDashboardService,
    public session: Session
  ) {}

  ngOnInit() {
    // this.subscription = this.analyticsService.timespan$.subscribe(timespan => {
    // if (this.filter.id === 'timespan') {
    //   this.selectedOption =
    //     this.filter.options.find(option => option.id === timespan) ||
    //     this.filter.options[0];

    //   // TODO: make selected option at top of array?
    // } else {
    // this.selectedOption =
    //   this.filter.options.find(option => option.selected === true) ||
    //   this.filter.options[0];
    // }
    // });

    this.selectedOption =
      this.filter.options.find(option => option.selected === true) ||
      this.filter.options[0];
    this.isMobile = isMobileOrTablet();
  }

  updateFilter(option: Option) {
    this.expanded = false;
    this.selectedOption = option;

    if (this.filter.id === 'timespan') {
      this.analyticsService.updateTimespan(option.id);
      return;
    }

    if (!this.selectedOption.available) {
      return;
    }
    const selectedFilterStr = `${this.filter.id}::${option.id}`;
    this.analyticsService.updateFilter(selectedFilterStr);
  }
}
