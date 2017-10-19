import { Component, EventEmitter } from '@angular/core';

import { KeyVal } from '../../../interfaces/entities';

export interface SocialProfileMeta {

  key: string;
  label: string;
  link: string;
  icon: string;
  customIcon?: boolean;
  domain: string;

}


@Component({
  moduleId: module.id,
  selector: 'minds-channel-social-profiles',
  inputs: ['_user : user', 'editing'],
  outputs: ['changed'],
  templateUrl: 'social-profiles.html'
})

export class ChannelSocialProfiles {

  socialProfiles: KeyVal[] = [];
  editing: boolean = false;
  changed: EventEmitter<any> = new EventEmitter();
  url: string = '';

  private socialProfileMeta: SocialProfileMeta[] = [
    {
      key: 'facebook',
      label: 'Facebook',
      link: 'https://www.facebook.com/:value',
      icon: 'facebook-official',
      domain: 'facebook.com',
    },
    {
      key: 'github',
      label: 'Github',
      link: 'https://github.com/:value',
      icon: 'github',
      domain: 'github.com',
    },
    {
      key: 'twitch',
      label: 'Twitch',
      link: 'https://www.twitch.tv/:value',
      icon: 'twitch',
      domain: 'twitch.tv',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      link: 'https://linkedin.com/in/:value',
      icon: 'linkedin',
      domain: 'linkedin.com',
    },
    {
      key: 'youtube_channel',
      label: 'YouTube Channel',
      link: 'https://www.youtube.com/channel/:value',
      icon: 'youtube',
      domain: 'youtube.com',
    },
    {
      key: 'minds',
      label: 'Minds',
      link: 'https://www.minds.com/:value',
      icon: 'minds',
      customIcon: true,
      domain: 'minds.com',
    },
    {
      key: 'reddit',
      label: 'Reddit',
      link: 'https://www.reddit.com/u/:value',
      icon: 'reddit',
      domain: 'reddit.com',
    },
    {
      key: 'soundcloud',
      label: 'SoundCloud',
      link: 'https://soundcloud.com/:value',
      icon: 'soundcloud',
      domain: 'soundcloud.com'
    },
    {
      key: 'tumblr',
      label: 'Tumblr Site',
      link: 'https://:value.tumblr.com',
      icon: 'tumblr',
      domain: 'tumblr.com',
    },
    {
      key: 'twitter',
      label: 'Twitter',
      link: 'https://twitter.com/:value',
      icon: 'twitter',
      domain: 'twitter.com',
    },
    {
      key: 'github',
      label: 'Github',
      link: 'https://github.com/:value',
      icon: 'github',
      domain: 'github.com',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      link: 'https://www.youtube.com/user/:value',
      icon: 'youtube',
      domain: 'youtube.com/user'

    },
    {
      key: 'instagram',
      label: 'Instagram',
      link: 'https://www.instagram.com/:value',
      icon: 'instagram',
      domain: 'instagram.com'
    },
    {
      key: 'wikipedia_user',
      label: 'Wikipedia User',
      link: 'https://wikipedia.org/wiki/:value',
      icon: 'wikipedia-w',
      domain: 'wikipedia.com'
    },
    {
      key: 'imdb_user',
      label: 'IMDb User',
      link: 'https://www.imdb.com/name/:value',
      icon: 'imdb',
      domain: 'imdb.com',
    },
    {
      key: 'other',
      label: 'Other',
      link: '',
      icon: 'link',
      domain: ''
    }
  ];

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
    let meta = this.getSocialProfileMeta(key),
      domClass;

    if (meta.customIcon) {
      domClass = `m-custom-icon m-custom-icon-${meta.icon}`;
    } else {
      domClass = `fa fa-fw fa-${meta.icon}`;
    }
    return domClass;
  }

  matchSocialProfile(index) {

    for (let sm of this.socialProfileMeta) {
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
      let meta = this.getSocialProfileMeta(profiles[i].key);
      if (profiles[i].key != 'other' && !profiles[i].value.includes('/')) {
        profiles[i].value = this.buildSocialProfileLink(profiles[i]);
      }
    }

    return profiles;
  }

  private buildSocialProfileLink({ key = '', value = '' }) {
    let link = this.getSocialProfileMeta(key).link;

    return link.replace(':value', value);
  }

  private getSocialProfileMeta(key: string): SocialProfileMeta {
    let defaultMeta: SocialProfileMeta = {
      key: '', label: '',
      link: '#', icon: 'link', domain: ''
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


}
