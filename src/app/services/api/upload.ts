import { Cookie } from '../cookie';
import { HttpClient } from '@angular/common/http';
import { SiteService } from '../../common/services/site.service';

/**
 * API Class
 */
export class Upload {
  base: string = '/';
  origin: string = '';
  cookie: Cookie = new Cookie();

  static _(http: HttpClient, site: SiteService) {
    return new Upload(http, site);
  }

  constructor(public http: HttpClient, protected site: SiteService) {
    if (this.site.isProDomain) {
      this.base = window.Minds.site_url;
      this.origin = document.location.host;
    }
  }

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
      xhr.upload.addEventListener('progress', function(e: any) {
        if (e.lengthComputable) {
          progress((e.loaded / e.total) * 99);
        }
      });
      xhr.onload = function(this: XMLHttpRequest) {
        if (this.status === 200) {
          progress(100);
          resolve(JSON.parse(this.response));
        } else {
          if (this.status === 504) {
            reject('error:gateway-timeout');
          } else {
            reject(this.response);
          }
        }
      };
      xhr.onreadystatechange = function() {
        //console.log(this);
      };
      const XSRF_TOKEN = this.cookie.get('XSRF-TOKEN');
      xhr.setRequestHeader('X-XSRF-TOKEN', XSRF_TOKEN);

      if (this.origin) {
        const PRO_XSRF_JWT = this.cookie.get('PRO-XSRF-JWT') || '';

        xhr.withCredentials = true;

        xhr.setRequestHeader('X-MINDS-ORIGIN', this.origin);
        xhr.setRequestHeader('X-PRO-XSRF-JWT', PRO_XSRF_JWT);
      }

      xhr.send(formData);
    });
  }
}
