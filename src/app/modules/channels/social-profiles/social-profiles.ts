import { Component, EventEmitter } from '@angular/core';

import { KeyVal } from '../../../interfaces/entities';
import {
  getSocialProfileMeta,
  SocialProfileMeta,
  socialProfileMeta,
} from './meta';

@Component({
  moduleId: module.id,
  selector: 'm-channel--social-profiles',
  inputs: ['_user : user', 'editing'],
  outputs: ['changed'],
  templateUrl: 'social-profiles.html',
})
export class ChannelSocialProfiles {
  socialProfiles: KeyVal[] = [];
  editing: boolean = false;
  changed: EventEmitter<any> = new EventEmitter();
  url: string = '';

  get socialProfilesMeta() {
    return socialProfileMeta;
  }

  set _user(value: any) {
    this.socialProfiles = this.polyfillLegacy(value.social_profiles) || [];
  }

  propagateChanges() {
    this.changed.emit(this.socialProfiles);
  }

  newEmptySocialProfile() {
    this.socialProfiles.push({
      key: '',
      value: '',
    });

    this.propagateChanges();
  }

  removeSocialProfile(index: number) {
    this.socialProfiles.splice(index, 1);

    this.propagateChanges();
  }

  getSocialProfileURL(url: string) {
    if (url.includes('http://') || url.includes('https://')) {
      return url;
    } else {
      return 'http://' + url;
    }
  }

  getSocialProfileIconClass({ key = '' }) {
    let meta = getSocialProfileMeta(key),
      domClass;

    if (meta.customIcon) {
      domClass = `m-custom-icon m-custom-icon-${meta.icon}`;
    } else {
      domClass = `fa fa-fw fa-${meta.icon}`;
    }
    return domClass;
  }

  matchSocialProfile(index) {
    for (let sm of this.socialProfilesMeta) {
      if (this.url.includes(sm.domain)) {
        this.socialProfiles[index].key = sm.key;
        this.socialProfiles[index].value = this.url;
        this.propagateChanges();
        return;
      }
    }
  }

  polyfillLegacy(profiles) {
    for (let i in profiles) {
      let meta = getSocialProfileMeta(profiles[i].key);
      if (profiles[i].key != 'other' && !profiles[i].value.includes('/')) {
        profiles[i].value = this.buildSocialProfileLink(profiles[i]);
      }
    }

    return profiles;
  }

  private buildSocialProfileLink({ key = '', value = '' }) {
    let link = getSocialProfileMeta(key).link;

    return link.replace(':value', value);
  }
}
