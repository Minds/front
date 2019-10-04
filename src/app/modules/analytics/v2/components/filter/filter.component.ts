import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy,
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
export class AnalyticsFilterComponent implements OnInit, OnDestroy {
  // TODO: extend Filter interface to allow additional fields (like for timespans?)
  @Input() filter: Filter;

  expanded = false;
  options: Array<any> = [];
  selectedOption: Option;
  subscription;
  vm$: Observable<UserState> = this.analyticsService.vm$;
  vm: UserState;
  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    this.subscription = this.vm$.subscribe(viewModel => (this.vm = viewModel));
    this.options = this.filter.options;

    this.selectedOption =
      this.options.find(option => option.selected === true) || this.options[0];
  }

  updateFilter(option: Option) {
    this.expanded = false;
    this.selectedOption = option;
    const selectedFilterStr = `${this.filter.id}::${option.id}`;

    if (
      this.vm.filter.includes(selectedFilterStr) ||
      !this.selectedOption.available
    ) {
      return;
    }

    console.log(this.vm.filter);

    const filterArr = this.vm.filter;
    const activeFilterIds = filterArr.map(filterStr => {
      return filterStr.split('::')[0];
    });
    console.log(activeFilterIds);
    const filterIndex = activeFilterIds.findIndex(
      filterId => filterId === this.filter.id
    );

    console.log(filterIndex);

    if (activeFilterIds.includes(selectedFilterStr)) {
      filterArr.splice(filterIndex, 1, selectedFilterStr);
    } else {
      filterArr.push(selectedFilterStr);
    }
    console.log(filterArr);

    //TODO make incoming string filterStr instead of option
    // const filterStr = somethingToDoWith_optionLabel;
    this.analyticsService.updateFilter(filterArr);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
