import WebTorrent from 'webtorrent';
import { Storage } from '../../services/storage';
import isMobile from '../../helpers/is-mobile';
import { isSafari } from '../../helpers/is-safari';
import { FeaturesService } from '../../services/features.service';

export const MAX_CONNS = 55;

export function getInfoHash(value) {
  if (typeof value !== 'string') {
    return value && value.toString ? value.toString() : '???';
  } else if (/^[a-f0-9]+$/.test) {
    return value;
  } else if (value.indexOf('magnet:') !== 0) {
    return `${value} [?]`;
  }

  return value
    .split('?')[1]
    .split('&')
    .find(q => q.startsWith('xt='))
    .substr(3);
}

const log = (magnetUri, ...args) =>
  console.log(`[WebTorrent ${getInfoHash(magnetUri)}]`, ...args);

export class WebtorrentService {
  protected supported: boolean;
  protected client: WebTorrent;
  protected torrentRefs: { [index: string]: number } = {};
  protected torrentPurgeTimers: { [index: string]: any } = {};

  constructor(
    protected storage: Storage,
    protected featuresService: FeaturesService
  ) {
    if (
      !this.isBrowserSupported() &&
      !this.storage.get('webtorrent:disabled')
    ) {
      this.storage.set('webtorrent:disabled', JSON.stringify(true));
    }
  }

  // Life-cycle

  setUp(maxConns: number = MAX_CONNS) {
    if (this.client) {
      this.destroy();
    }

    this.setUpSupport();

    if (this.isSupported() && this.isEnabled()) {
      this.client = new WebTorrent({
        maxConns,
        webSeeds: true,
      });

      this.client.on('error', err => {
        console.error('Webtorrent client', err);
      });

      // TODO: Setup global event listeners, if needed
    }

    return this;
  }

  destroy() {
    const client = this.client;
    this.client = void 0;
    this.torrentRefs = {};

    for (let magnetUri in this.torrentPurgeTimers) {
      clearTimeout(this.torrentPurgeTimers[magnetUri]);
      delete this.torrentPurgeTimers[magnetUri];
    }

    if (!client) {
      return Promise.resolve(this);
    }

    return new Promise((resolve, reject) => {
      client.destroy(err => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  /**
   * Determines whether webtorrent is to be enabled for user
   * @returns { boolean } - true if webtorrent enabled, supported and user is opted in.
   */
  isEnabled = (): boolean => false; // Deprecated due to bade performance on minds

  setEnabled(enabled: boolean) {
    const current = this.isEnabled();

    if (current && !enabled) {
      this.destroy();
    } else if (!current && enabled) {
      this.setUp();
    }

    return this;
  }

  setUpSupport() {
    this.supported = 'MediaStream' in window && WebTorrent.WEBRTC_SUPPORT;

    return this;
  }

  isBrowserSupported() {
    return !isMobile() && !isSafari();
  }

  isSupported() {
    return this.isEnabled() && this.supported;
  }

  isReady() {
    return this.isSupported() && !!this.client;
  }

  // Torrent Manager

  add(torrentData, infoHash: string): Promise<any> {
    log(infoHash, 'Trying to add');
    if (!this.torrentRefs[infoHash]) {
      this.torrentRefs[infoHash] = 0;
    }

    this.torrentRefs[infoHash]++;

    const current = this.client.get(infoHash);

    if (current) {
      log(infoHash, 'Already exists');
      return Promise.resolve(current);
    }

    return new Promise((resolve, reject) => {
      log(infoHash, 'Adding new');
      try {
        const torrent = this.client.add(torrentData, torrent =>
          resolve(torrent)
        );

        torrent.on('error', err => {
          console.error('Torrent error', infoHash, err);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  remove(infoHash) {
    log(infoHash, 'Trying to remove');
    if (this.torrentRefs[infoHash] && this.torrentRefs[infoHash] > 0) {
      this.torrentRefs[infoHash]--;
    }

    if (!this.torrentRefs[infoHash]) {
      log(infoHash, 'No references, added to purge timer');

      if (this.torrentPurgeTimers[infoHash]) {
        clearTimeout(this.torrentPurgeTimers[infoHash]);
      }

      this.torrentPurgeTimers[infoHash] = setTimeout(
        () => this.purge(infoHash),
        30000
      );
      this.torrentRefs[infoHash] = 0;
    }
  }

  get(infoHash) {
    return this.client.get(infoHash);
  }

  purge(infoHash) {
    log(infoHash, 'Trying to purge');
    if (!this.torrentRefs[infoHash]) {
      log(infoHash, 'No references, purging');
      this.client.remove(infoHash);
    }
  }

  // DI

  static _(storage: Storage, featuresService: FeaturesService) {
    return new WebtorrentService(storage, featuresService);
  }

  static _deps: any[] = [Storage, FeaturesService];
}
