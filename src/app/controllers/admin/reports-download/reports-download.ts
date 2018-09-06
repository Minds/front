import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { blobDownload } from '../../../utils/blob-download';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-admin--reports-download',
  templateUrl: 'reports-download.html',
})

/**
 * Admin Reports Download
 */
export class AdminReportsDownload {

  reports: any[] = null;
  downloading = false;
  error = '';
  selectedReport = 0;
  with_titles = false;

  /**
   * constructor
   * @param client Client
   */
  constructor(public client: Client) {

    const d = new Date();
    d.setHours(23, 59, 59);
    const endDate = d.toISOString();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0);
    const startDate = d.toISOString();

    // Reports definition
    this.reports = [
      {
        name: 'Token Sale',
        endpoint: 'api/v2/blockchain/transactions/reports',
        report: 'TokenSaleEvent',
        options: { type: 'text/csv;charset=utf-8;' },
        file_name: 'toke_sale_event.csv',
        params: {
          from: {
            label: 'From',
            value: startDate,
            type: 'date',
            map: (v) => Math.floor((new Date(v)).getTime() / 1000) // format the output
          },
          to: {
            label: 'To',
            value: endDate,
            type: 'date',
            map: (v) => Math.floor((new Date(v)).getTime() / 1000) // format the output
          },
        }
      },
      {
        name: 'Eth Price',
        endpoint: 'api/v2/blockchain/transactions/reports',
        report: 'EthereumPrice',
        options: { type: 'text/csv;charset=utf-8;' },
        file_name: 'eth_price.csv',
        params: {
          from: {
            label: 'From',
            value: startDate,
            type: 'date',
            map: (v) => Math.floor((new Date(v)).getTime() / 1000) // format the output
          },
          to: {
            label: 'To',
            value: endDate,
            type: 'date',
            map: (v) => Math.floor((new Date(v)).getTime() / 1000) // format the output
          },
          resolution: {
            label: 'Resolution',
            value: 300,
            type: 'select',
            options: [
              {label: '5 minutes', value: 300},
              {label: '15 minutes', value: 900},
              {label: '30 minutes', value: 1800},
              {label: '2 hours', value: 7200},
              {label: '4 hours', value: 14400},
              {label: '1 day', value: 86400}
            ],
          },
        }
      }
    ];
  }

  ngOnInit() {}

  ngOnDestroy() {}

  /**
   * Download report
   */
  async download(params) {
    const selectedReport = this.reports[this.selectedReport];

    params.report = selectedReport.report;

    if (this.with_titles) {
      params._titles = true;
    }

    this.downloading = true;
    try {
      const res: any = await this.client.getRaw(selectedReport.endpoint, params);
      blobDownload(res._body, selectedReport.options, selectedReport.file_name);
    } catch (e) {
      this.error = e.message || 'Download Error';
    }
    this.downloading = false;
  }

  /**
   * Set selected report
   * @param r string
   */
  setReport(r) {
    this.selectedReport = r;
  }

}
