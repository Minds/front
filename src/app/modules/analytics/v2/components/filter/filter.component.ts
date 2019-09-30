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

@Component({
  selector: 'm-analytics__filter',
  templateUrl: 'filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsFilterComponent implements OnInit {
  @Input() filter: Filter;

  @Output() filterChanged: EventEmitter<{
    selectedFilterStr;
  }> = new EventEmitter();

  expanded: boolean = false;
  options: Array<any> = [];
  selectedOption = {};
  selectedFilterStr;
  vm$: Observable<UserState> = this.analyticsService.vm$;
  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    this.options = this.filter.options;

    this.selectedOption =
      this.options.find(option => option.selected === true) || this.options[0];
  }

  // TODO: make this work for multiple filters
  changeFilterOption(option: Option) {
    this.expanded = false;
    this.selectedOption = option;
    this.selectedFilterStr = `${this.filter.id}::${option.id}`;

    // this.filterChanged.emit(this.selectedFilterStr);
    this.analyticsService.updateFilter(this.selectedFilterStr);
  }
}
