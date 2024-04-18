import { CookieService } from '../../common/services/cookie.service';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';

/**
 * API Class
 */
export class Upload {
  base: string = '/';
  onError: EventEmitter<any> = new EventEmitter<any>();

  static _(http: HttpClient, cookie: CookieService) {
    return new Upload(http, cookie);
  }

  constructor(
    public http: HttpClient,
    private cookie: CookieService
  ) {}

  /**
   * Return a POST request
   */
  post(
    endpoint: string,
    files: Array<any> = [],
    data: any = {},
    progress: Function = () => {
      return;
    },
    xhr: XMLHttpRequest = null
  ) {
    const self = this;
    const formData = new FormData();
    if (!data.filekey) {
      data.filekey = 'file';
    }

    if (files.length > 1) {
      for (let file of files) formData.append(data.filekey + '[]', file);
    } else {
      formData.append(data.filekey, files[0]);
    }

    delete data.filekey;

    for (let key in data) {
      if (data[key] !== null) {
        const field =
          typeof data[key] == 'object' ? JSON.stringify(data[key]) : data[key];
        formData.append(key, field);
      }
    }

    return new Promise((resolve, reject) => {
      if (!xhr) {
        xhr = new XMLHttpRequest();
      }
      xhr.open('POST', this.base + endpoint, true);
      xhr.upload.addEventListener('progress', function (e: any) {
        if (e.lengthComputable) {
          progress((e.loaded / e.total) * 99);
        }
      });
      xhr.onload = function (this: XMLHttpRequest) {
        if (this.status === 200) {
          progress(100);
          resolve(JSON.parse(this.response));
        } else {
          try {
            self.onError.next({
              error: { ...JSON.parse(this.response) },
              status: this.status,
            });
            if (this.status === 504) {
              reject('error:gateway-timeout');
            } else {
              reject(JSON.parse(this.response));
            }
          } catch (e) {
            // Likely unable to parse JSON from response.
            // Reject with user friendly error.
            reject('An unknown error has occurred during upload');
          }
        }
      };
      xhr.onreadystatechange = function () {
        //console.log(this);
      };
      const XSRF_TOKEN = this.cookie.get('XSRF-TOKEN');
      xhr.setRequestHeader('X-XSRF-TOKEN', XSRF_TOKEN);
      xhr.send(formData);
    });
  }
}
