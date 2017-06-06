import { Component } from '@angular/core';
import { CurrencyPipe } from "@angular/common";

import { ChartColumn } from "../../common/components/chart/chart.component";
import { Client } from "../../services/api";

@Component({
  moduleId: module.id,
  selector: 'm-monetization--analytics',
  templateUrl: 'analytics.component.html',
  providers: [
    CurrencyPipe
  ]
})
export class MonetizationAnalytics {
  transactions: any[] = [];
  inProgress: boolean = false;

  offset: string = '';
  moreData: boolean = false;

  error: string;

  chart: { title: string, columns: ChartColumn[], rows: any[][] } | null = null;
  chartInProgress: boolean = false;

  constructor(private client: Client, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.load(true);
  }

  load(refresh: boolean = false) {
    let tasks: Promise<any>[] = [
      this.loadList(refresh)
    ];

    if (refresh) {
      tasks.push(this.loadChart());
    }

    return Promise.all(tasks);
  }

  // ListTable related

  loadList(refresh = false): Promise<any> {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.offset = '';
      this.moreData = true;
    }

    return this.client.get(`api/v1/monetization/service/analytics/list`, {
      offset: this.offset,
      limit: 12
    })
      .then(({ transactions, 'load-next': loadNext }) => {
        this.inProgress = false;

        if (transactions) {
          this.transactions.push(...transactions);
        }

        if (loadNext) {
          this.offset = loadNext;
        } else {
          this.moreData = false;
        }
      })
      .catch(e => {
        this.inProgress = false;
        this.error = e.message || 'Server error';
      });
  }

  // Chart related

  loadChart(): Promise<any> {
    if (this.chartInProgress) {
      return;
    }

    this.chartInProgress = true;
    this.error = '';

    return this.client.get(`api/v1/monetization/service/analytics/chart`, { })
      .then(({ chart }) => {
        this.chartInProgress = false;
        this.chart = this._parseChart(chart);
      })
      .catch(e => {
        this.chartInProgress = false;
        this.error = e.message || 'Server error';
      });
  }

  private _parseChart(data) {
    if (!data) {
      return null;
    }

    let chart = { // @todo: type correctly
      title: data.title || void 0,
      columns: [],
      rows: []
    };

    for (let dataColumn of (data.columns || [])) {
      let column = { ...dataColumn }; // clone
      if (column.type == 'currency') {
        column.type = 'number';
      }

      chart.columns.push(column);
    }

    for (let dataRow of data.rows) {
      for (let colIndex = 0; colIndex < dataRow.length; colIndex++) {
        if (data.columns[colIndex] && data.columns[colIndex].type == 'currency') {
          dataRow[colIndex] = { v: dataRow[colIndex], f: this.currencyPipe.transform(dataRow[colIndex], 'USD', true) }
        }
      }

      chart.rows.push(dataRow);
    }

    return chart;
  }
}
