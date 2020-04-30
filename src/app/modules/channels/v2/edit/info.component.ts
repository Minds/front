import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelEditService } from './edit.service';
import { LocationTypeaheadResponse } from '../location-typeahead/location-typeahead.component';

/**
 * About Info accordion pane component
 */
@Component({
  selector: 'm-channelEdit__info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'info.component.html',
})
export class ChannelEditInfoComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelEditService) {}

  /**
   * Sets the location
   * @param location
   */
  onLocation(location: LocationTypeaheadResponse): void {
    this.service.location$.next(location.location);
    this.service.coordinates$.next(location.coordinates);
  }
}
