import { Injectable } from '@angular/core';
import { Filter, Option } from '../../../../../../interfaces/dashboard';
import * as moment from 'moment';

/** Default timespan filter ID. */
export const DEFAULT_TIMESPAN_FILTER_ID: string = '30d';

/**
 * Service for getting of network admin analytics timespan filters.
 */
@Injectable({ providedIn: 'root' })
export class NetworkAdminAnalyticsTimespanFiltersService {
  /** Timestamp of service instantiation. */
  public readonly instantiationTimestamp: moment.Moment = moment().utc();

  /** Internal reference to the filters. */
  private _filters: Filter;

  /**
   * Exposed getter for the timespan filters.
   * @returns { Filter } - the timespan filters.
   */
  public get filters(): Filter {
    if (!this._filters) {
      this._filters = this.getFilters();
    }
    return this._filters;
  }

  /**
   * Gets the timespan filters.
   * @returns { Filter } - the timespan filters.
   */
  private getFilters(): Filter {
    return {
      id: 'timespan',
      label: 'Timespan',
      options: [
        {
          id: '7d',
          label: 'Last 7 days',
          selected: false,
          interval: 'day',
          from_ts_ms: this.instantiationTimestamp
            .clone()
            .subtract(7, 'days')
            .startOf('day')
            .unix(),
        },
        {
          id: '30d',
          label: 'Last 30 days',
          selected: true,
          interval: 'day',
          from_ts_ms: this.instantiationTimestamp
            .clone()
            .subtract(30, 'days')
            .startOf('day')
            .unix(),
        },
        {
          id: '1y',
          label: 'Last 12 months',
          selected: false,
          interval: 'month',
          from_ts_ms: this.instantiationTimestamp
            .clone()
            .subtract(1, 'year')
            .startOf('day')
            .unix(),
        },
        {
          id: 'ytd',
          label: 'Year to date',
          selected: false,
          interval: 'month',
          from_ts_ms: moment().startOf('year').startOf('day').unix(),
        },
      ],
    };
  }

  /**
   * Gets an option by its ID.
   * @param { string } id - the ID of the option to get.
   * @returns { Option } - the option with the given ID.
   */
  public getOptionById(id: string): Option {
    return this.filters?.options?.find((option) => option?.id === id);
  }

  /**
   * Patches the selected value of the filters such that the option
   * with an id matching the id parameter is the only option selected.
   * @param { string } id - the ID of the option to force selection of.
   * @returns { void }
   */
  public forceSelectionById(id: string): void {
    this.filters.options.map((option: Option) => {
      option.selected = option.id === id;
    });
  }
}
