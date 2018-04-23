import WebTorrent from 'webtorrent';
import { Storage } from '../../services/storage';
import isMobile from '../../helpers/is-mobile';

export const MAX_CONNS = 55;

export function magnetHashId(magnetUri: string) {
  return magnetUri.split('?')[1].split('&').find(q => q.startsWith('xt=')).substr(3);
}

const log =
  (magnetUri, ...args) =>
    console.log(`[WebTorrent ${magnetHashId(magnetUri)}]`, ...args);

export class WebtorrentService {
  protected supported: boolean;
  protected client: WebTorrent;
  protected torrentRefs: { [index:string]: number } = {};
  protected torrentPurgeTimers: { [index:string]: any } = {};

  constructor(
    protected storage: Storage,
  ) {
    if (isMobile() && !this.storage.get('webtorrent:disabled')) {
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
          reject(err)
        } else {
          resolve(this);
        }
      });
    });
  }

  // Enable/Disable; Support

  isEnabled() {
    const value = this.storage.get('webtorrent:disabled');

    return !value || !JSON.parse(value);
  }

  setEnabled(enabled: boolean) {
    const current = this.isEnabled();
    this.storage.set('webtorrent:disabled', JSON.stringify(!enabled));

    if (current && !enabled) {
      this.destroy();
    } else if (!current && enabled) {
      this.setUp();
    }

    return this;
  }

  setUpSupport() {
    this.supported = false;
    //this.supported = ('MediaStream' in window) && WebTorrent.WEBRTC_SUPPORT;

    return this;
  }

  isSupported() {
    return this.isEnabled() && this.supported;
  }

  isReady() {
    return this.isSupported() && !!this.client;
  }

  // Torrent Manager

  add(magnetUri): Promise<any> {
    log(magnetUri, 'Trying to add');
    if (!this.torrentRefs[magnetUri]) {
      this.torrentRefs[magnetUri] = 0;
    }

    this.torrentRefs[magnetUri]++;

    const current = this.client.get(magnetUri);

    if (current) {
      log(magnetUri, 'Already exists');
      return Promise.resolve(current);
    }

    return new Promise(resolve => {
      log(magnetUri, 'Adding new');
      this.client.add(magnetUri, torrent => resolve(torrent))
    });
  }

  remove(magnetUri) {
    log(magnetUri, 'Trying to remove');
    if (this.torrentRefs[magnetUri] && this.torrentRefs[magnetUri] > 0) {
      this.torrentRefs[magnetUri]--;
    }

    if (!this.torrentRefs[magnetUri]) {
      log(magnetUri, 'No references, added to purge timer');

      if (this.torrentPurgeTimers[magnetUri]) {
        clearTimeout(this.torrentPurgeTimers[magnetUri]);
      }

      this.torrentPurgeTimers[magnetUri] = setTimeout(
        () => this.purge(magnetUri),
        30000
      );
      this.torrentRefs[magnetUri] = 0;
    }
  }

  get(magnetUri) {
    return this.client.get(magnetUri);
  }

  purge(magnetUri) {
    log(magnetUri, 'Trying to purge');
    if (!this.torrentRefs[magnetUri]) {
      log(magnetUri, 'No references, purging');
      this.client.remove(magnetUri);
    }
  }

  // DI

  static _(storage: Storage) {
    return new WebtorrentService(storage);
  }

  static _deps: any[] = [ Storage ];
}
