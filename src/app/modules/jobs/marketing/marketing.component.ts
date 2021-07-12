import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-jobs--marketing',
  templateUrl: 'marketing.component.html',
  styleUrls: ['marketing.component.ng.scss'],
})
export class JobsMarketingComponent {
  user;

  constructor(
    private session: Session,
    public configs: ConfigsService,
    private http: HttpClient
  ) {}

  gotoLink(link) {
    console.log(`Go to -> ${link}`);
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();

    const headers = new HttpHeaders().set(
      'Authorization',
      'Basic a3A0dlN2NDgxeTFtMi9jMGg1NG5xRFZMU28zcWdpNGk2UmZRRUtIS2Nsb210RytWOg=='
    );

    this.http
      .get('https://api.lever.co/v1/postings', { headers })
      .subscribe(data => {
        console.log('data', data);
        // this.postings = data;
      });
  }
}
