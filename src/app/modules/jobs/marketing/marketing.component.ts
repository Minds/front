import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-jobs--marketing',
  templateUrl: 'marketing.component.html',
  styleUrls: ['marketing.component.ng.scss'],
})
export class JobsMarketingComponent {
  constructor(public configs: ConfigsService, private http: HttpClient) {}

  gotoLink(link) {
    console.log(`Go to -> ${link}`);
  }

  ngOnInit() {
    const options = {
      headers: new HttpHeaders().append(
        'Authorization',
        `Basic ${btoa('kp4vSv481y1m2/c0h54nqDVLSo3qgi4i6RfQEKHKclomtG+V:')}`
      ),
    };

    this.http
      .get('https://api.lever.co/v1/postings', options)
      .subscribe(data => {
        console.log('data', data);
        // this.postings = data;
      });
  }
}
