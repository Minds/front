import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-reports',
  templateUrl: 'reports.html',
})

export class AdminReports {

  type: string = 'review'
  reports: any[] = [];

  inProgress : boolean = false;
  moreData : boolean = true;
  offset : string = '';

  subjects: any = {
    'spam': 'It\'s spam',
    'sensitive': 'It displays a sensitive image',
    'abusive': 'It\'s abusive or harmful',
    'annoying': 'It shouldn\'t be on Minds'
  };

  constructor(public client: Client, private route: ActivatedRoute){
  }

  paramsSubscription: Subscription;  
  ngOnInit() {
    this.type = 'review';
    
    this.paramsSubscription = this.route.params.subscribe((params: any) => {
      if (params['type']) {
        this.type = params['type'];
      }

      this.load(true);
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(refresh: boolean = false) {
    if (this.inProgress) {
      return;
    }

    if (refresh) {
      this.reports = [];
      this.offset = "";
      this.moreData = true;
    }

    this.inProgress = true;

    this.client.get(`api/v1/admin/reports/${this.type}`, { limit: 24, offset: this.offset })
    .then((response: any) => {
      if(!response.reports){
        this.inProgress = false;
        this.moreData = false;
        return;
      }

      this.reports = this.reports.concat(response.reports);
      this.offset = response['load-next'];
      this.inProgress = false;
    })
    .catch(e => {
      this.inProgress = false;
    });
  }

  removeFromList(index) {
    if (this.type === 'history') {
      return;
    }

    this.reports.splice(index, 1);
  }

  archive(report: any, index: number) {
    this.client.post(`api/v1/admin/reports/${report.guid}/archive`, {})
    .then((response: any) => {
      if (!response.done) {
        alert('There was a problem archiving this report. Please reload.');
      }
    })
    .catch(e => {
      alert('There was a problem archiving this report. Please reload.');
    });

    this.removeFromList(index);
  }

  explicit(report: any, index: number) {
    if (!confirm('This will make this content explicit. Are you sure?')) {
      return;
    }

    this.client.post(`api/v1/admin/reports/${report.guid}/explicit`, {})
    .then((response: any) => {
      if (!response.done) {
        alert('There was a problem marking this content. Please reload.');
      }
    })
    .catch(e => {
      alert('There was a problem marking this content. Please reload.');
    });

    this.removeFromList(index);
  }

  delete(report: any, index: number) {
    if (!confirm('This will delete this from Minds. Are you sure?')) {
      return;
    }

    this.client.post(`api/v1/admin/reports/${report.guid}/delete`, {})
    .then((response: any) => {
      if (!response.done) {
        alert('There was a problem deleting this content. Please reload.');
      }
    })
    .catch(e => {
      alert('There was a problem deleting this content. Please reload.');
    });

    this.removeFromList(index);
  }
}
