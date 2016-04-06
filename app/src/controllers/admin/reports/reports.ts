import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, Location, ROUTER_DIRECTIVES } from 'angular2/router';

import { Client } from '../../../services/api';
import { CARDS } from '../../../controllers/cards/cards';
import { Material } from '../../../directives/material';

import { InfiniteScroll } from '../../../directives/infinite-scroll';

@Component({
  selector: 'minds-admin-reports',
  templateUrl: 'src/controllers/admin/reports/reports.html',
  directives: [ CORE_DIRECTIVES, Material, ROUTER_DIRECTIVES, CARDS, InfiniteScroll ]
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

  constructor(public client: Client, public params : RouteParams){
    if(params.params['type']) {
      this.type = params.params['type'];
    } else {
      this.type = 'review';
    }

    this.load();
  }

  load() {
    if (this.inProgress) {
      return;
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

  archive(report: any, index: number) {
    this.client.post(`api/v1/admin/reports/${report._id}/archive`, {})
    .then((response: any) => {
      if (!response.done) {
        alert('There was a problem archiving this report. Please reload.');
      }
    })
    .catch(e => {
      alert('There was a problem archiving this report. Please reload.');
    });

    this.reports.splice(index, 1);
  }

  ignore(report: any, index: number) {
    if (!confirm('This will ignore this report. Are you sure?')) {
      return;
    }

    this.client.post(`api/v1/admin/reports/${report._id}/ignore`, {})
    .then((response: any) => {
      if (!response.done) {
        alert('There was a problem ignoring this report. Please reload.');
      }
    })
    .catch(e => {
      alert('There was a problem ignoring this report. Please reload.');
    });

    this.reports.splice(index, 1);
  }

  explicit(report: any, index: number) {
    if (!confirm('This will make this content explicit. Are you sure?')) {
      return;
    }

    this.client.post(`api/v1/admin/reports/${report._id}/explicit`, {})
    .then((response: any) => {
      if (!response.done) {
        alert('There was a problem marking this content. Please reload.');
      }
    })
    .catch(e => {
      alert('There was a problem marking this content. Please reload.');
    });

    this.reports.splice(index, 1);
  }

  delete(report: any, index: number) {
    if (!confirm('This will delete this from Minds. Are you sure?')) {
      return;
    }

    this.client.post(`api/v1/admin/reports/${report._id}/delete`, {})
    .then((response: any) => {
      if (!response.done) {
        alert('There was a problem deleting this content. Please reload.');
      }
    })
    .catch(e => {
      alert('There was a problem deleting this content. Please reload.');
    });

    this.reports.splice(index, 1);
  }
}
