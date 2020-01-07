import { Component } from '@angular/core';

@Component({
  selector: 'm-analyticssite__networkactivity',
  template: `
    <m-analyticsoffchainboosts__card></m-analyticsoffchainboosts__card>
    <m-analyticsonchainboosts__card></m-analyticsonchainboosts__card>

    <m-analyticsoffchainplus__card></m-analyticsoffchainplus__card>
    <m-analyticsonchainplus__card></m-analyticsonchainplus__card>

    <m-analyticsoffchainwire__card></m-analyticsoffchainwire__card>

    <m-analyticswithdraw__card></m-analyticswithdraw__card>

    <m-analyticstokensales__card></m-analyticstokensales__card>

    <m-analyticsrewards__card></m-analyticsrewards__card>
  `,
})
export class SiteTokenTransactionsAnalyticsComponent {}
