import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class GoogleChartsLoader {

  private readonly packages = [
    'corechart',
    'line',
  ];

  private readyPromise: Promise<any>;

  static _(ngZone: NgZone): GoogleChartsLoader {
    return new GoogleChartsLoader(ngZone);
  }

  constructor(private ngZone: NgZone) { }

  ready(): Promise<any> {
    if (!this.readyPromise) {
      this.readyPromise = this._scriptReady().then(() => this._loaderReady());
    }

    return this.readyPromise;
  }

  private _scriptReady(): Promise<any> {
    if (window.google && window.google.charts) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      let _timer;

      _timer = setInterval(() => {
        if (window.google && window.google.charts) {
          clearInterval(_timer);
          resolve(true);
        }
      }, 250);
    });
  }

  private _loaderReady(): Promise<any> {
    return new Promise((resolve, reject) => {
      window.google.charts.load('current', { packages: this.packages });

      window.google.charts.setOnLoadCallback(() => {
        setTimeout(() => {
          this.ngZone.run(() => resolve(true));
        }, 500);
      });
    });
  }

}
