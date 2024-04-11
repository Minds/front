import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelEditService } from './edit.service';
import { LocationTypeaheadResponse } from '../location-typeahead/location-typeahead.component';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * About Info accordion pane component
 * Allows users to edit their channel's location, birthday, display name
 */
@Component({
  selector: 'm-channelEdit__info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'info.component.html',
})
export class ChannelEditInfoComponent {
  public maxNameLength: number;

  /**
   * Constructor
   * @param service
   */
  constructor(
    public service: ChannelEditService,
    configs: ConfigsService
  ) {
    this.maxNameLength = configs.get('max_name_length') ?? 50;
  }

  /**
   * Sets the location
   * @param location
   */
  onLocation(location: LocationTypeaheadResponse): void {
    this.service.location$.next(location.location);
    this.service.coordinates$.next(location.coordinates);
  }
}
