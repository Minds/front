import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-analyticschannel__reach',
  template: `
    <m-analyticsinteractions__card></m-analyticsinteractions__card>
    <m-analyticschannelboosts__card></m-analyticschannelboosts__card>
  `,
})
export class ChannelReachAnalyticsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
