import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { MindsUser } from '../../../interfaces/entities';

import { HashtagsSelectorComponent } from '../../hashtags/selector/selector.component';
import { Tag } from '../../hashtags/types/tag';

@Component({
  moduleId: module.id,
  selector: 'm-channel--sidebar',
  inputs: ['user', 'editing'],
  templateUrl: 'sidebar.html'
})

export class ChannelSidebar {

  minds = window.Minds;
  filter: any = 'feed';
  isLocked: boolean = false;
  editing: boolean = false;
  user: MindsUser;
  searching;
  errorMessage: string = '';
  amountOfTags: number = 0;
  tooManyTags: boolean = false;

  @Output() changeEditing = new EventEmitter<boolean>();

  //@todo make a re-usable city selection module to avoid duplication here
  cities: Array<any> = [];

  constructor(
    public client: Client,
    public upload: Upload,
    public session: Session,
  ) {}

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
  }

  toggleEditing() {
    
    if (this.tooManyTags) {
      return;
    }

    this.changeEditing.next(!this.editing);
  }

  upload_avatar(file) {
    var self = this;
    this.upload.post('api/v1/channel/avatar', [file], { filekey: 'file' })
      .then((response: any) => {
        self.user.icontime = Date.now();
        if(window.Minds.user)
          window.Minds.user.icontime = Date.now();
      });
  }

  findCity(q: string) {
    if (this.searching) {
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client.get('api/v1/geolocation/list', { q: q })
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
    if (row.address.town)
      this.user.city = row.address.town;
    if (window.Minds)
      window.Minds.user.city = this.user.city;
    this.client.post('api/v1/channel/info', {
      coordinates: row.lat + ',' + row.lon,
      city: window.Minds.user.city
    });
  }


  onTagsChange(tags: string[]) {
    this.amountOfTags = tags.length;
    if (this.amountOfTags > 5) {
      this.errorMessage = "You can only select up to 5 hashtags";
      this.tooManyTags = true;
    } else {
      this.tooManyTags = false;
      this.user.tags = tags;
      if (this.errorMessage === "You can only select up to 5 hashtags") {
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

