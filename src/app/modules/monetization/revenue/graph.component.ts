import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { ChartColumn } from '../../../common/components/chart/chart.component';
import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-revenue--graph',
  templateUrl: 'graph.component.html',
  providers: [
    CurrencyPipe
  ]
})
export class RevenueGraphComponent {

  inProgress: boolean = false;
  chart: { title: string, columns: ChartColumn[], rows: any[][] } | null = null;

  constructor(private client: Client, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.loadGraph();
  }

  loadGraph() {
    if (this.inProgress)
      return false;

    this.inProgress = true;

    //default
    let defaultChart = {
      columns: [
        { label: 'Date' },
        { label: 'Amount', type: 'currency' }
      ],
      rows: []
    };
    for (let i = 0; i < 14; i++) {
      defaultChart.rows[i] = ['0/0', 0];
    }
    this.chart = this._parseChart(defaultChart);

    return this.client.get(`api/v1/monetization/service/analytics/chart`)
      .then(({ chart }) => {
        this.inProgress = false;
        this.chart = this._parseChart(chart);
      })
      .catch(e => {
        this.inProgress = false;
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
      if (column.type === 'currency') {
        column.type = 'number';
      }

      chart.columns.push(column);
    }

    for (let dataRow of data.rows) {
      for (let colIndex = 0; colIndex < dataRow.length; colIndex++) {
        if (data.columns[colIndex] && data.columns[colIndex].type === 'currency') {
          dataRow[colIndex] = { v: dataRow[colIndex], f: this.currencyPipe.transform(dataRow[colIndex], 'USD', true) };
        }
      }

      chart.rows.push(dataRow);
    }

    return chart;
  }
}
