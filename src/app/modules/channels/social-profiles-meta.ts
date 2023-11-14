import { KeyVal } from '../../interfaces/entities';

export interface SocialProfileMeta {
  key: string;
  label: string;
  linkFormat: string;
  icon: string;
  domain: string;
  customIcon?: boolean;
  verified?: boolean;
}

export const socialProfileMeta: SocialProfileMeta[] = [
  {
    key: 'deviantart',
    label: 'Deviantart',
    linkFormat: 'https://:value.deviantart.com/',
    icon: 'deviantart',
    domain: 'deviantart.com',
  },
  {
    key: 'discord',
    label: 'Discord',
    linkFormat: 'https://discord.me/:value',
    icon: 'discord',
    domain: 'discord.me',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    linkFormat: 'https://www.facebook.com/:value',
    icon: 'facebook-official',
    domain: 'facebook.com',
  },
  {
    key: 'flickr',
    label: 'Flickr',
    linkFormat: 'https://www.flickr.com/photos/:value/',
    icon: 'flickr',
    domain: 'flickr.com',
  },
  {
    key: 'flipboard',
    label: 'Flipboard',
    linkFormat: 'https://www.flipboard.com/:value',
    icon: 'flipboard',
    domain: 'flipboard.com',
  },
  {
    key: 'github',
    label: 'Github',
    linkFormat: 'https://github.com/:value',
    icon: 'github',
    domain: 'github.com',
    customIcon: true,
  },
  {
    key: 'gitlab',
    label: 'Gitlab',
    linkFormat: 'https://www.gitlab.com/:value',
    icon: 'gitlab',
    domain: 'gitlab.com',
  },
  {
    key: 'gitter',
    label: 'Gitter',
    linkFormat: 'https://gitter.im/:value',
    icon: 'gitter',
    domain: 'gitter.im',
  },
  {
    key: 'goodreads',
    label: 'Goodreads',
    linkFormat: 'https://www.goodreads.com/user/show/:value',
    icon: 'goodreads',
    domain: 'goodreads.com',
  },
  {
    key: 'google_plus',
    label: 'Google Plus',
    linkFormat: 'https://plus.google.com/:value',
    icon: 'google-plus',
    domain: 'google.com',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    linkFormat: 'https://www.instagram.com/:value',
    icon: 'instagram',
    domain: 'instagram.com',
    customIcon: true,
  },
  {
    key: 'imdb_user',
    label: 'IMDb',
    linkFormat: 'https://www.imdb.com/name/:value',
    icon: 'imdb',
    domain: 'imdb.com',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    linkFormat: 'https://linkedin.com/in/:value',
    icon: 'linkedin',
    domain: 'linkedin.com',
  },
  {
    key: 'mastodon',
    label: 'Mastodon',
    linkFormat: 'https://mastodon.social/:value',
    icon: 'mastodon',
    domain: 'mastodon.social',
    customIcon: true,
  },
  {
    key: 'medium',
    label: 'Medium',
    linkFormat: 'https://medium.com/:value',
    icon: 'medium',
    domain: 'medium.com',
  },
  {
    key: 'minds',
    label: 'Minds',
    linkFormat: 'https://www.minds.com/:value',
    icon: 'bulb',
    domain: 'minds.com',
    customIcon: true,
  },
  {
    key: 'odysee',
    label: 'Odysee',
    linkFormat: 'https://odysee.com/@:value',
    icon: 'odysee',
    domain: 'odysee.com',
    customIcon: true,
  },
  {
    key: 'patreon',
    label: 'Patreon',
    linkFormat: 'https://www.patreon.com/:value',
    icon: 'patreon',
    domain: 'patreon.com',
  },
  {
    key: 'reddit',
    label: 'Reddit',
    linkFormat: 'https://www.reddit.com/u/:value',
    icon: 'reddit',
    domain: 'reddit.com',
  },
  {
    key: 'rumble',
    label: 'Rumble',
    linkFormat: 'https://rumble.com/c/:value',
    icon: 'rumble',
    domain: 'reddit.com',
    customIcon: true,
  },
  {
    key: 'slack',
    label: 'Slack',
    linkFormat: 'https://:value.slack.com',
    icon: 'slack',
    domain: 'slack.com',
  },
  {
    key: 'snapchat',
    label: 'Snapchat',
    linkFormat: 'https://snapchat.com/add/:value',
    icon: 'snapchat',
    domain: 'snapchat.com',
  },
  {
    key: 'soundcloud',
    label: 'SoundCloud',
    linkFormat: 'https://soundcloud.com/:value',
    icon: 'soundcloud',
    domain: 'soundcloud.com',
  },
  {
    key: 'spotify',
    label: 'Spotify',
    linkFormat: 'https://open.spotify.com/user/:value',
    icon: 'spotify',
    domain: 'open.spotify.com',
  },
  {
    key: 'steam',
    label: 'Steam',
    linkFormat: 'https://steamcommunity.com/id/:value/',
    icon: 'steam',
    domain: 'steamcommunity.com',
  },
  {
    key: 'threads',
    label: 'Threads',
    linkFormat: 'https://threads.net/@:value',
    icon: 'threads',
    domain: 'threads.net',
    customIcon: true,
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    linkFormat: 'https://tiktok.com/@:value',
    icon: 'tiktok',
    domain: 'tiktok.com',
    customIcon: true,
  },
  {
    key: 'tumblr',
    label: 'Tumblr Site',
    linkFormat: 'https://:value.tumblr.com',
    icon: 'tumblr',
    domain: 'tumblr.com',
  },
  {
    key: 'twitter',
    label: 'Twitter',
    linkFormat: 'https://twitter.com/:value',
    icon: 'x-twitter',
    domain: 'twitter.com',
    customIcon: true,
  },
  {
    key: 'twitch',
    label: 'Twitch',
    linkFormat: 'https://www.twitch.tv/:value',
    icon: 'twitch',
    domain: 'twitch.tv',
  },
  {
    key: 'wikipedia_user',
    label: 'Wikipedia',
    linkFormat: 'https://wikipedia.org/wiki/:value',
    icon: 'wikipedia-w',
    domain: 'wikipedia.com',
  },
  {
    key: 'x',
    label: 'X',
    linkFormat: 'https://x.com/:value',
    icon: 'x-twitter',
    domain: 'x.com',
    customIcon: true,
  },
  {
    key: 'youtube_channel',
    label: 'YouTube',
    linkFormat: 'https://www.youtube.com/channel/:value',
    icon: 'youtube',
    domain: 'youtube.com',
    customIcon: true,
  },
  {
    key: 'other',
    label: 'Other',
    linkFormat: '',
    icon: 'link',
    domain: '',
    customIcon: true,
  },
];

export function getSocialProfileMeta(key: string): SocialProfileMeta {
  let defaultMeta: SocialProfileMeta = {
    key: '',
    label: '',
    linkFormat: '#',
    icon: 'link',
    domain: '',
    customIcon: true,
  };

  if (!key) {
    return defaultMeta;
  }

  for (let i in socialProfileMeta) {
    if (socialProfileMeta[i].key === key) {
      return socialProfileMeta[i];
    }
  }

  return defaultMeta;
}

/**
 * Polyfill for pre-2019 social profile metadata in channels
 * @param profiles
 */
export function buildFromV1ChannelProfile(
  profiles: Array<KeyVal>
): Array<KeyVal> {
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].key !== 'other' && !profiles[i].value.includes('/')) {
      profiles[i].value = getSocialProfileMeta(
        profiles[i].key
      ).linkFormat.replace(':value', profiles[i].value);
    }
  }

  return profiles;
}

export function buildKeyVal(url: string): KeyVal {
  for (let meta of socialProfileMeta) {
    if (url.includes(meta.domain)) {
      if (meta.domain === 'x.com') {
        // if the url includes x.com, check it's not
        // just another url that happens to end in 'x.com'
        // by ensuring if it was preceded by anything,
        // the beginning of that url was http(s):// or www.
        const urlBeginning = url.substring(0, url.indexOf('x.com'));
        const precedingChar = urlBeginning.charAt(urlBeginning.length - 1);
        if (precedingChar && precedingChar !== '/' && precedingChar !== '.') {
          return {
            key: 'other',
            value: url,
          };
        }
      }
      return {
        key: meta.key,
        value: url,
      };
    }
  }
  return {
    key: 'other',
    value: url,
  };
}
