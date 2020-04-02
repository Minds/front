import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-analytics__benchmark',
  templateUrl: './benchmark.component.html',
})
export class AnalyticsBenchmarkComponent implements OnInit {
  @Input() label: string;
  @Input() description: string;
  @Input() value: string | number;
  @Input() unit: string;
  @Input() noChart: boolean = false;

  isCurrency: boolean = false;

  constructor() {}

  ngOnInit() {
    if (this.unit && (this.unit === 'eth' || this.unit === 'usd')) {
      this.isCurrency = true;
    }
  }

  isNumber(val) {
    return typeof val === 'number';
  }
}
