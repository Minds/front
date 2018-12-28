import { Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Cookie } from '../../services/cookie';

/**
 * API Class
 */
export class HttpClient {

  base: string = '/';
  cookie: Cookie = new Cookie();

  static _(http: Http) {
    return new HttpClient(http);
  }

  constructor(public http: Http) {
  }

  /**
   * Return a GET request
   */
  get(endpoint: string, data: Object = {}, options: Object = {}) {
    endpoint += '?' + this.buildParams(data);
    return this.http.get(
        this.base + endpoint,
        this.buildOptions(options)
      );
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
    return this.http.delete(
      this.base + endpoint,
      this.buildOptions(options)
    );
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
    var XSRF_TOKEN = this.cookie.get('XSRF-TOKEN');
    var headers = new Headers();
    headers.append('X-XSRF-TOKEN', XSRF_TOKEN);
    var Objecti: any = Object;
    return Objecti.assign(options, {
      headers: headers,
      cache: true
    });
  }

}


export { Client } from '../../services/api/client';
