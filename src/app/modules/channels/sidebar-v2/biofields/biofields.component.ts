import { Component, Input, OnInit } from '@angular/core';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';
import { Tag } from '../../../hashtags/types/tag';
import { Client } from '../../../../services/api/client';

@Component({
  selector: 'm-channelbiofields',
  templateUrl: 'biofields.component.html',
})
export class ChannelBiofieldsComponent implements OnInit {
  @Input() user: MindsUser;
  @Input() editing: boolean;

  searching;
  amountOfTags: number = 0;

  tooManyTags: boolean = false;
  errorMessage: string = '';

  // @todo make a re-usable city selection module to avoid duplication here
  cities: Array<any> = [];

  constructor(public session: Session, public client: Client) {}

  ngOnInit() {}

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
  }

  findCity(q: string) {
    if (this.searching) {
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client
        .get('api/v1/geolocation/list', { q: q })
        .then((response: any) => {
          this.cities = response.results;
        });
    }, 100);
  }

  setCity(row: any) {
    this.cities = [];
    if (row.address.city) {
      this.user.city = row.address.city;
    }
    if (row.address.town) {
      this.user.city = row.address.town;
    }
    if (window.Minds) {
      window.Minds.user.city = this.user.city;
    }
    this.client.post('api/v1/channel/info', {
      coordinates: row.lat + ',' + row.lon,
      city: window.Minds.user.city,
    });
  }

  onTagsChange(tags: string[]) {
    this.amountOfTags = tags.length;
    if (this.amountOfTags > 5) {
      this.errorMessage = 'You can only select up to 5 hashtags';
      this.tooManyTags = true;
    } else {
      this.tooManyTags = false;
      this.user.tags = tags;
      if (this.errorMessage === 'You can only select up to 5 hashtags') {
        this.errorMessage = '';
      }
    }
  }

  onTagsAdded(tags: Tag[]) {}

  onTagsRemoved(tags: Tag[]) {}

  setSocialProfile(value: any) {
    this.user.social_profiles = value;
  }
}
