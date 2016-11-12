import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Material } from '../../../directives/material';

import { KeyVal } from '../../../interfaces/entities';

export interface SocialProfileMeta {
    key: string,
    label: string,
    placeholder: string,
    link: string,
    icon: string,
    customIcon?: boolean,
}

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

  private socialProfileMeta: SocialProfileMeta[] = [
    {
      key: 'minds',
      label: 'Minds',
      placeholder: 'Username',
      link: 'https://www.minds.com/:value',
      icon: 'minds',
      customIcon: true,
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
      key: 'twitch',
      label: 'Twitch',
      placeholder: 'Username',
      link: 'https://www.twitch.tv/:value',
      icon: 'twitch'
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
      key: 'reddit_sub',
      label: 'Subreddit',
      placeholder: 'Subreddit',
      link: 'https://www.reddit.com/r/:value',
      icon: 'reddit'
    },
    {
      key: 'github',
      label: 'Github',
      placeholder: 'Username',
      link: 'https://github.com/:value',
      icon: 'github'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      placeholder: 'Username',
      link: 'https://linkedin.com/:value',
      icon: 'linkedin'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      placeholder: 'Username',
      link: 'https://www.instagram.com/:value',
      icon: 'instagram'
    },
    {
      key: 'wikipedia_user',
      label: 'Wikipedia User',
      placeholder: 'Username',
      link: 'https://wikipedia.org/wiki/:value',
      icon: 'wikipedia-w'
    },
    {
      key: 'imdb_user',
      label: 'IMDb User',
      placeholder: 'Name',
      link: 'https://www.imdb.com/name/:value',
      icon: 'imdb'
    },      
  ];

  private getSocialProfileMeta(key: string): SocialProfileMeta {
    let defaultMeta: SocialProfileMeta = {
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

  getSocialProfileIconClass({ key = '' }) {
    let meta = this.getSocialProfileMeta(key),
      domClass;

    if (meta.customIcon) {
      domClass = `m-custom-icon m-custom-icon-${meta.icon}`;
    } else {
      domClass = `fa fa-fw fa-${meta.icon}`;
    }

    return domClass;
  }

  buildSocialProfileLink({ key = '', value = '' }) {
    let link = this.getSocialProfileMeta(key).link;

    return link.replace(':value', value);
  }
}
