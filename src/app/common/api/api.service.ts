import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from '../services/cookie.service';
import { environment } from '../../../environments/environment';

export enum ApiRequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type ApiRequestData = {
  [key: string]: any;
} | null;

export type ApiRequestQueryParams = {
  [key: string]: any;
} | null;

export type ApiRequestOptions = {
  upload?: boolean;
  withCredentials?: boolean;
  headers?: { [name: string]: string | string[] };
};

export interface ApiResponse {
  status: string;
  [key: string]: any;
}

@Injectable()
export class ApiService {
  protected baseUrl: string = '';

  constructor(
    @Inject('ORIGIN_URL') baseUrl: string,
    protected httpClient: HttpClient,
    protected cookie: CookieService
  ) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
  }

  get(
    endpoint: string,
    queryParams: ApiRequestQueryParams = null,
    options: ApiRequestOptions = {}
  ): Observable<HttpEvent<ApiResponse>> {
    return this.request(
      ApiRequestMethod.GET,
      this._buildQueryString(endpoint, queryParams),
      {},
      options
    );
  }

  post(
    endpoint: string,
    data: ApiRequestData = null,
    options: ApiRequestOptions = {}
  ): Observable<HttpEvent<ApiResponse>> {
    return this.request(ApiRequestMethod.POST, endpoint, data, options);
  }

  put(
    endpoint: string,
    data: ApiRequestData = null,
    options: ApiRequestOptions = {}
  ): Observable<HttpEvent<ApiResponse>> {
    return this.request(ApiRequestMethod.PUT, endpoint, data, options);
  }

  delete(
    endpoint: string,
    queryParams: ApiRequestQueryParams = null,
    options: ApiRequestOptions = {}
  ): Observable<HttpEvent<ApiResponse>> {
    return this.request(
      ApiRequestMethod.DELETE,
      this._buildQueryString(endpoint, queryParams),
      {},
      options
    );
  }

  request(
    method: ApiRequestMethod,
    endpoint: string,
    data: ApiRequestData,
    options: ApiRequestOptions
  ): Observable<HttpEvent<ApiResponse>> {
    let observable = this.httpClient.request<ApiResponse>(
      method,
      endpoint,
      this._buildOptions(options, data)
    );

    // TODO: Make it fail if status !== 'success' on 200
    // TODO: Add retry() operator

    return observable;
  }

  /**
   * Builds HTTP Request endpoint string
   * @param endpoint
   * @param queryParams
   * @private
   */
  protected _buildQueryString(
    endpoint: string,
    queryParams: ApiRequestQueryParams
  ): string {
    let output = endpoint;

    if (/^\/([^\/])/.test(output)) {
      output = output.substr(1);
    }

    output = this.baseUrl.replace(/\/+$/, '') + '/' + output;

    if (queryParams) {
      const queryString = Object.keys(queryParams)
        .map(
          key =>
            `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
        )
        .join('&');

      if (queryString) {
        output += (endpoint.indexOf('?') > -1 ? '&' : '?') + queryString;
      }
    }

    return output;
  }

  /**
   * Builds HTTP Request options object
   * @param {ApiRequestOptions} options
   * @param {ApiRequestData} data
   * @private
   */
  protected _buildOptions(options: ApiRequestOptions, data: ApiRequestData) {
    const requestOptions: any = {
      observe: 'events',
      responseType: 'json',
      reportProgress: options.upload,
      withCredentials: options.withCredentials,
      headers: this._buildHeaders(),
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    return requestOptions;
  }

  /**
   * Builds HTTP Request headers object
   * @private
   */
  protected _buildHeaders(): HttpHeaders {
    const XSRF_TOKEN = this.cookie.get('XSRF-TOKEN') || '';

    return new HttpHeaders({
      'X-XSRF-TOKEN': XSRF_TOKEN,
      'X-VERSION': environment.version,
    });
  }
}
