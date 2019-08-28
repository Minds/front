import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';
import { REASONS, REPORT_ACTIONS } from '../../../services/list-options';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-reports',
  templateUrl: 'reports.html',
})
export class AdminReports {
  filter: string = 'reports';
  type: string = 'review';
  reports: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';
  paramsSubscription: Subscription;

  reasons: Array<{ value; label }> = REASONS;

  constructor(public client: Client, private route: ActivatedRoute) {}

  ngOnInit() {
    this.type = 'review';

    this.paramsSubscription = this.route.params.subscribe((params: any) => {
      if (params['filter']) {
        this.filter = params['filter'];
      }

      if (params['type']) {
        this.type = params['type'];
      }

      this.load(true);
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.inProgress = false;
      this.reports = [];
      this.offset = '';
      this.moreData = true;
    }

    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    try {
      let response: any = await this.client.get(
        `api/v1/admin/reports/${this.type}`,
        { limit: 24, offset: this.offset }
      );

      if (refresh) {
        this.reports = [];
      }

      if (response.reports) {
        this.reports.push(...response.reports);
      }

      if (response['load-next']) {
        this.offset = response['load-next'];
      } else {
        this.moreData = false;
      }
    } catch (e) {
      alert((e && e.message) || 'Error getting list');
    } finally {
      this.inProgress = false;
    }
  }

  parseReason(reasonValue: string | number) {
    let reason = reasonValue;

    REASONS.forEach(item => {
      if (item.value === reasonValue) {
        reason = item.label;
      }
    });

    return reason;
  }

  parseAction(action: string) {
    return typeof REPORT_ACTIONS[action] !== 'undefined'
      ? REPORT_ACTIONS[action]
      : action;
  }

  removeFromList(index) {
    if (this.type === 'history') {
      return;
    }

    this.reports.splice(index, 1);
  }

  async archive(report: any, index: number) {
    this.removeFromList(index);

    try {
      let response: any = await this.client.post(
        `api/v1/admin/reports/${report.guid}/archive`,
        {}
      );

      if (!response.done) {
        alert('There was a problem archiving this report. Please reload.');
      }
    } catch (e) {
      alert(
        (e && e.message) ||
          'There was a problem archiving this report. Please reload.'
      );
    }
  }

  async explicit(report: any, index: number) {
    if (!confirm('This will make this content explicit. Are you sure?')) {
      return;
    }

    this.removeFromList(index);

    try {
      let response: any = await this.client.post(
        `api/v1/admin/reports/${report.guid}/explicit`,
        { reason: report.reason }
      );

      if (!response.done) {
        alert(
          'There was a problem marking this content as explicit. Please reload.'
        );
      }
    } catch (e) {
      alert(
        (e && e.message) ||
          'There was a problem marking this content as explicit. Please reload.'
      );
    }
  }

  async spam(report: any, index: number) {
    if (!confirm('This will mark this content as spam. Are you sure?')) {
      return;
    }

    this.removeFromList(index);

    try {
      let response: any = await this.client.post(
        `api/v1/admin/reports/${report.guid}/spam`,
        { reason: report.reason }
      );

      if (!response.done) {
        alert(
          'There was a problem marking this content as spam. Please reload.'
        );
      }
    } catch (e) {
      alert(
        (e && e.message) ||
          'There was a problem marking this content as spam. Please reload.'
      );
    }
  }

  async delete(report: any, index: number) {
    if (!confirm('This will delete this from Minds. Are you sure?')) {
      return;
    }

    this.removeFromList(index);

    try {
      let response: any = await this.client.post(
        `api/v1/admin/reports/${report.guid}/delete`,
        { reason: report.reason }
      );

      if (!response.done) {
        alert('There was a problem deleting this content. Please reload.');
      }
    } catch (e) {
      alert(
        (e && e.message) ||
          'There was a problem deleting this content. Please reload.'
      );
    }
  }

  async approveAppeal(report: any, index: number) {
    if (
      !confirm(
        `This will approve an appeal and undo the last administrative action. There's no UNDO. Are you sure?`
      )
    ) {
      return;
    }

    this.removeFromList(index);

    try {
      let response: any = await this.client.put(
        `api/v1/admin/reports/appeals/${report.guid}`,
        { reason: report.reason }
      );

      if (!response.done) {
        alert(
          `There was a problem approving this content's appeal. Please reload.`
        );
      }
    } catch (e) {
      alert(
        (e && e.message) ||
          `There was a problem approving this content's appeal. Please reload.`
      );
    }
  }

  async rejectAppeal(report: any, index: number) {
    if (
      !confirm(`This will reject an appeal. There's no UNDO. Are you sure?`)
    ) {
      return;
    }

    this.removeFromList(index);

    try {
      let response: any = await this.client.delete(
        `api/v1/admin/reports/appeals/${report.guid}`,
        { reason: report.reason }
      );

      if (!response.done) {
        alert(
          `There was a problem rejecting this content's appeal. Please reload.`
        );
      }
    } catch (e) {
      alert(
        (e && e.message) ||
          `There was a problem rejecting this content's appeal. Please reload.`
      );
    }
  }
}
