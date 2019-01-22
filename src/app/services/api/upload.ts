import { Cookie } from '../cookie';
import { HttpClient } from "@angular/common/http";

/**
 * API Class
 */
export class Upload {

  base: string = '/';
  cookie: Cookie = new Cookie();

  static _(http: HttpClient) {
    return new Upload(http);
  }

  constructor(public http: HttpClient) { }

	/**
	 * Return a POST request
	 */
  post(endpoint: string, files: Array<any> = [], data: any = {}, progress: Function = () => { return; }, xhr: XMLHttpRequest = null) {
    const formData = new FormData();
    if (!data.filekey) {
      data.filekey = 'file';
    }

    if (files.length > 1) {
      for (let file of files)
        formData.append(data.filekey + '[]', file);
    } else {
      formData.append(data.filekey, files[0]);
    }

    delete data.filekey;

    for (let key in data) {
      if (data[key] !== null) {
        formData.append(key, data[key]);
      }
    }

    return new Promise((resolve, reject) => {
      if(!xhr) {
        xhr = new XMLHttpRequest();
      }
      xhr.open('POST', this.base + endpoint, true);
      xhr.upload.addEventListener('progress', function (e: any) {
        progress(e.loaded / e.total * 100);
      });
      xhr.onload = function (this: XMLHttpRequest) {
        if (this.status === 200) {
          resolve(JSON.parse(this.response));
        } else {
          reject(this.response);
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
