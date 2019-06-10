import { Cookie } from '../cookie';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { makeStateKey, TransferState } from '@angular/platform-browser';

/**
 * API Class
 */
export class Client {

  base: string = 'https://eggman.minds.com/';
  cookie: Cookie = new Cookie();

  static _(http: HttpClient, platformId, transferState: TransferState) {
    return new Client(http, platformId, transferState);
  }

  constructor(
    public http: HttpClient,
    @Inject(PLATFORM_ID) private platformId,
    private transferState: TransferState,
  ) {
  }

  /**
   * Return a GET request
   */
  get(endpoint: string, data: Object = {}, options: Object = {}) {
    if (data) {
      endpoint += '?' + this.buildParams(data);
    }

    const STATE_KEY = makeStateKey(`http-${endpoint}` + JSON.stringify(options));
    
    if (this.transferState.hasKey(STATE_KEY)) {
      const result = this.transferState.get(STATE_KEY, null);
      this.transferState.remove(STATE_KEY);
      return Promise.resolve(JSON.parse(result));
    }

    return new Promise((resolve, reject) => {
      this.http.get(
        this.base + endpoint,
        this.buildOptions(options)
      )
        .subscribe(
          res => {
            var data: any = res;
            if (!data || data.status !== 'success')
              return reject(data);

            if (isPlatformServer(this.platformId)) {
              const dump = JSON.stringify(data);
              if (dump.length < 10000)
                this.transferState.set(STATE_KEY, dump);
            }
            return resolve(data);
          },
          err => {
            if (err.data && !err.data()) {
              return reject(err || new Error('GET error'));
            }
            if (err.status === 401 && err.error.loggedin === false) {
              window.location.href = '/login';
              return reject(err);
            }
            return reject(err);
          });
    });
  }

  /**
   * Return a GET request
   */
  getRaw(endpoint: string, data: Object = {}, options: Object = {}) {
    endpoint += '?' + this.buildParams(data);
    return new Promise((resolve, reject) => {
      this.http.get(
        this.base + endpoint,
        this.buildOptions(options)
      )
        .subscribe(
          res => {
            return resolve(res);
          },
          err => {
            if (err.data && !err.data()) {
              return reject(err || new Error('GET error'));
            }
            if (err.status === 401 && err.error.loggedin === false) {
              window.location.href = '/login';
              return reject(err);
            }
            return reject(err);
          });
    });
  }

  /**
   * Return a POST request
   */
  post(endpoint: string, data: Object = {}, options: Object = {}) {
    return new Promise((resolve, reject) => {
      this.http.post(
        this.base + endpoint,
        JSON.stringify(data),
        this.buildOptions(options)
      )
        .subscribe(
          res => {
            var data: any = res;
            if (!data || data.status !== 'success')
              return reject(data);

            return resolve(data);
          },
          err => {
            if (err.data && !err.data()) {
              return reject(err || new Error('POST error'));
            }
            if (err.status === 401 && err.loggedin === false) {
              window.location.href = '/login';
              return reject(err);
            }
            if (err.status !== 200) {
              return reject(err.error);
            }
          });
    });
  }

  /**
   * Return a PUT request
   */
  put(endpoint: string, data: Object = {}, options: Object = {}) {
    return new Promise((resolve, reject) => {
      this.http.put(
        this.base + endpoint,
        JSON.stringify(data),
        this.buildOptions(options)
      )
        .subscribe(
          res => {
            var data: any = res;
            if (!data || data.status !== 'success')
              return reject(data);

            return resolve(data);
          },
          err => {
            if (err.status === 401 && err.data().loggedin === false) {
              window.location.href = '/login';
              return reject(err);
            }
            if (err.status !== 200) {
              return reject(err.error);
            }
          });
    });
  }

  /**
   * Return a DELETE request
   */
  delete(endpoint: string, data: Object = {}, options: Object = {}) {
    return new Promise((resolve, reject) => {
      this.http.delete(
        this.base + endpoint,
        this.buildOptions(options)
      )
        .subscribe(
          res => {
            var data: any = res;
            if (!data || data.status !== 'success')
              return reject(data);

            return resolve(data);
          },
          err => {
            if (err.status === 401 && err.error.loggedin === false) {
              window.location.href = '/login';
              return reject(err);
            }
            if (err.status !== 200) {
              return reject(err.error);
            }
          });
    });
  }

  private buildParams(object: Object) {
    return Object.keys(object).map((k) => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(object[k]);
    }).join('&');
  }

  /**
   * Build the options
   */
  private buildOptions(options: Object) {
    if (isPlatformServer(this.platformId)) {
      return options; // TODO: support XSRF on universal
    }
    const XSRF_TOKEN = this.cookie.get('XSRF-TOKEN');

    const headers = new HttpHeaders({
      'X-XSRF-TOKEN': XSRF_TOKEN,
    });

    return Object.assign(options, {
      headers: headers,
      cache: true
    });
  }

}
