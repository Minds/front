import { Cookie } from '../../services/cookie';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { SiteService } from '../services/site.service';

/**
 * API Class
 */
export class MindsHttpClient {
  base: string = '/';
  origin: string = '';
  cookie: Cookie = new Cookie();

  static _(http: HttpClient, site: SiteService) {
    return new MindsHttpClient(http, site);
  }

  constructor(public http: HttpClient, protected site: SiteService) {
    if (this.site.isProDomain) {
      this.base = window.Minds.site_url;
      this.origin = document.location.host;
    }
  }

  /**
   * Return a GET request
   */
  get(endpoint: string, data: Object = {}, options: Object = {}) {
    endpoint += '?' + this.buildParams(data);
    return this.http.get(this.base + endpoint, this.buildOptions(options));
    //     .map(response => response.json());
  }

  /**
   * Return a POST request
   */
  post(endpoint: string, data: Object = {}, options: Object = {}) {
    return this.http.post(
      this.base + endpoint,
      JSON.stringify(data),
      this.buildOptions(options)
    );
  }

  /**
   * Return a PUT request
   */
  put(endpoint: string, data: Object = {}, options: Object = {}) {
    return this.http.put(
      this.base + endpoint,
      JSON.stringify(data),
      this.buildOptions(options)
    );
  }

  /**
   * Return a DELETE request
   */
  delete(endpoint: string, data: Object = {}, options: Object = {}) {
    return this.http.delete(this.base + endpoint, this.buildOptions(options));
  }

  private buildParams(object: Object) {
    return Object.keys(object)
      .map(k => {
        return encodeURIComponent(k) + '=' + encodeURIComponent(object[k]);
      })
      .join('&');
  }

  x;
  /**
   * Build the options
   */
  private buildOptions(options: Object) {
    const XSRF_TOKEN = this.cookie.get('XSRF-TOKEN') || '';

    const headers = {
      'X-XSRF-TOKEN': XSRF_TOKEN,
      'X-VERSION': environment.version,
    };

    if (this.origin) {
      const PRO_XSRF_JWT = this.cookie.get('PRO-XSRF-JWT') || '';

      headers['X-MINDS-ORIGIN'] = this.origin;
      headers['X-PRO-XSRF-JWT'] = PRO_XSRF_JWT;
    }

    const builtOptions = {
      headers: new HttpHeaders(headers),
      cache: true,
    };

    if (this.origin) {
      builtOptions['withCredentials'] = true;
    }

    return Object.assign(options, builtOptions);
  }
}

export { Client } from '../../services/api/client';
