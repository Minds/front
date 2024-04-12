import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';
import { debounceTime, map, switchAll } from 'rxjs/operators';

/**
 * Output binding response
 */
export interface LocationTypeaheadResponse {
  location: string;
  coordinates?: string;
}

/**
 * Channel location typeahead input component
 * Provides suggestions of real world locations based on user input
 */
@Component({
  selector: 'm-channel__locationTypeahead',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'location-typeahead.component.html',
})
export class ChannelLocationTypeaheadComponent implements OnInit, OnDestroy {
  /**
   * Location state
   */
  location: string = '';

  /**
   * Location binding
   * @param location
   * @private
   */
  @Input('location') set _location(location: string) {
    this.onLocationChange(location, false);
  }

  /**
   * Location change emitter
   */
  @Output('locationChange')
  locationChangeEmitter: EventEmitter<LocationTypeaheadResponse> =
    new EventEmitter<LocationTypeaheadResponse>();

  /**
   * Current suggestion query
   */
  readonly locationSuggestionQuery$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  /**
   * Suggestions array from API
   */
  readonly locationSuggestions$: Observable<Array<LocationTypeaheadResponse>>;

  /**
   * Is the dropdown open?
   */
  readonly isOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Timer for dropdown close operation
   */
  protected dropdownCloseTimer: any;

  /**
   * Dirty flag for manual set
   */
  protected dirty: boolean = false;

  /**
   * Constructor. Sets lookup pipe.
   * @param api
   */
  constructor(protected api: ApiService) {
    // Set the lookup pipe
    this.locationSuggestions$ = this.locationSuggestionQuery$.pipe(
      debounceTime(300),
      map((locationSuggestionQuery) => this.fetch(locationSuggestionQuery)),
      switchAll(),
      map((response) => {
        if (!response || !response.results) {
          return [];
        }

        return response.results
          .map((entry) => this.fromApiResponse(entry))
          .filter(Boolean);
      })
    );
  }

  /**
   * Component initialization
   */
  ngOnInit(): void {
    if (!this.location) {
      // If location is empty, set dirty flag to true to ensure event emission
      this.dirty = true;
    }
  }

  /**
   * Component destruction
   */
  ngOnDestroy(): void {
    if (this.dropdownCloseTimer) {
      clearTimeout(this.dropdownCloseTimer);
    }
  }

  /**
   * Fetches a set of results from the server
   * @param q
   */
  protected fetch(q: string): Observable<ApiResponse> {
    if (!q) {
      return of(null);
    }

    return this.api.get('api/v1/geolocation/list', { q });
  }

  /**
   * Transforms API response entries to the response parents expect
   * @param data
   */
  protected fromApiResponse(data: any): LocationTypeaheadResponse {
    if (!data || (!data.address.city && !data.address.state)) {
      return null;
    }

    return {
      location: [data.address.city, data.address.state]
        .filter(Boolean)
        .join(', '),
      coordinates: `${data.lat},${data.lon}`,
    };
  }

  /**
   * Sets the current location and suggestion query
   * @param location
   * @param markAsDirty
   */
  onLocationChange(location: string, markAsDirty: boolean = true): void {
    this.location = location;
    this.locationSuggestionQuery$.next(location);

    if (markAsDirty) {
      this.dirty = true;
    }
  }

  /**
   * Sets the current location from dropdown and resets suggestion query
   * @param location
   * @param emit
   */
  setLocation(location: LocationTypeaheadResponse, emit: boolean = true) {
    this.location = location.location;
    this.locationSuggestionQuery$.next('');

    if (emit) {
      this.locationChangeEmitter.emit(location);
    }
  }

  /**
   * Opens the dropdown
   */
  onInputFocus(): void {
    if (this.dropdownCloseTimer) {
      clearTimeout(this.dropdownCloseTimer);
    }

    this.isOpen$.next(true);
  }

  /**
   * Sets a manual location when user changes the dropdown focus, if dirty flag is set. Closes dropdown.
   */
  onInputBlur(): void {
    if (this.dropdownCloseTimer) {
      clearTimeout(this.dropdownCloseTimer);
    }

    this.dropdownCloseTimer = setTimeout(() => {
      this.isOpen$.next(false);
    }, 200);

    if (this.dirty) {
      this.locationChangeEmitter.emit({
        location: this.location,
        coordinates: '',
      });
    }
  }
}
