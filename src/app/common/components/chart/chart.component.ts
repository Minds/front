import { Component, AfterViewInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { GoogleChartsLoader } from '../../../services/third-party/google-charts-loader';

export interface ChartColumn {
  type?: string;
  label: string;
}

@Component({
  moduleId: module.id,
  selector: 'm-chart',
  template: `
    <div class="m-chart-container" #container></div>
  `,
  host:{
    '(window:resize)' : 'draw()'
  }
})
export class ChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() type: string;
  @Input() columns: ChartColumn[];
  @Input() rows: any[][];

  @ViewChild('container') containerElement: ElementRef;

  private _chartInstance: any;
  private _chartOptions: any = {};

  private _resizeWatch: Subscription;

  constructor(private ngZone: NgZone, private googleChartsLoader: GoogleChartsLoader) { }

  ngAfterViewInit() {
    this.googleChartsLoader.ready()
      .then(() => {
        this.attach();
        this.draw();
      });

    this._resizeWatch = fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .subscribe(value => {
        this.ngZone.run(() => this.draw());
      });
  }

  ngOnDestroy() {
    if (this._resizeWatch) {
      this._resizeWatch.unsubscribe();
    }
  }

  ngOnChanges() {
    this.draw();
  }

  attach() {
    let chartClass;

    switch (this.type) {
      case 'line':
        chartClass = window.google.charts.Line;
        //this._chartOptions = {
        //  curveType: 'function',
        //  legend: 'none'
        //};
        break;
      default:
        throw new Error('Unknown chart type');
    }

    this._chartInstance = new chartClass(this.containerElement.nativeElement);
  }

  draw() {
    if (!this._chartInstance) {
      return;
    }

    if (!this.columns || this.columns.length < 2) {
      throw new Error('Charts must have at least 2 columns');
    }

    let data = new window.google.visualization.DataTable();

    for (let column of this.columns) {
      data.addColumn(column.type || 'string', column.label);
    }

    data.addRows(this.rows);

    this._chartInstance.draw(data, {
      chart: {
        title: this.title,
        subtitle: this.subtitle
      },
      axisTitlesPosition: 'none',
      axes: {
        x: {
          0: { side: 'bottom', label: ''}
        }
      },
      legend: {
        position: 'none'
      },
      animation: { // @note: animation doesn't work yet in the current implementation of Material Charts
        startup: true,
        duration: 1000,
        easing: 'out',
      },
      chartArea: {
        backgroundColor: 'transparent'
      },
      curveType: 'function'
    });
  }
}
