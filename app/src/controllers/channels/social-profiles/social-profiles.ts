import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Material } from '../../../directives/material';

import { KeyVal } from '../../../interfaces/entities';

@Component({
  selector: 'minds-channel-social-profiles',
  inputs: ['_user : user', 'editing'],
  outputs: ['changed'],
  templateUrl: 'src/controllers/channels/social-profiles/social-profiles.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, Material ]
})

export class ChannelSocialProfiles {
  socialProfiles: KeyVal[];
  editing: boolean = false;
  changed: EventEmitter<any> = new EventEmitter();

  private socialProfileMeta = [
    {
      key: 'minds',
      label: 'Minds',
      placeholder: 'Username',
      link: 'https://www.minds.com/:value',
      icon: 'lightbulb-o'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      placeholder: 'Username or ID',
      link: 'https://www.facebook.com/:value',
      icon: 'facebook-official'
    },
    {
      key: 'twitter',
      label: 'Twitter',
      placeholder: 'Username',
      link: 'https://twitter.com/:value',
      icon: 'twitter'
    },
    {
      key: 'youtube_user',
      label: 'YouTube User',
      placeholder: 'Username',
      link: 'https://www.youtube.com/user/:value',
      icon: 'youtube'
    },
    {
      key: 'youtube_channel',
      label: 'YouTube Channel',
      placeholder: 'Channel ID',
      link: 'https://www.youtube.com/channel/:value',
      icon: 'youtube'
    },
    {
      key: 'soundcloud',
      label: 'SoundCloud',
      placeholder: 'Username',
      link: 'https://soundcloud.com/:value',
      icon: 'soundcloud'
    },
    {
      key: 'reddit',
      label: 'Reddit',
      placeholder: 'Username',
      link: 'https://www.reddit.com/u/:value',
      icon: 'reddit'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      placeholder: 'Username',
      link: 'https://linkedin.com/:value',
      icon: 'linkedin'
    },
  ];

  private getSocialProfileMeta(key: string) {
    let defaultMeta = {
      key: '', label: '',
      placeholder: '',
      link: '#', icon: 'question'
    };

    if (!key) {
      return defaultMeta;
    }

    for (let i in this.socialProfileMeta) {
      if (this.socialProfileMeta[i].key === key) {
        return this.socialProfileMeta[i];
      }
    }

    return defaultMeta;
  }

  set _user(value: any) {
    this.socialProfiles = value.social_profiles || [];
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

  getSocialProfileLabel({ key = '' }) {
    return this.getSocialProfileMeta(key).label;
  }

  getSocialProfilePlaceholder({ key = '' }) {
    return this.getSocialProfileMeta(key).placeholder;
  }

  getSocialProfileIcon({ key = '' }) {
    return this.getSocialProfileMeta(key).icon;
  }

  buildSocialProfileLink({ key = '', value = '' }) {
    let link = this.getSocialProfileMeta(key).link;

    return link.replace(':value', value);
  }
}
