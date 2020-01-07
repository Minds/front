import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-analyticssite__networkactivity',
  template: `
    <m-analyticsactiveusers__card></m-analyticsactiveusers__card>
    <m-analyticspageviews__card></m-analyticspageviews__card>
    <m-analyticsusersegments__card></m-analyticsusersegments__card>
    <m-analyticsengagement__card></m-analyticsengagement__card>
  `,
})
export class SiteNetworkActivityAnalyticsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
