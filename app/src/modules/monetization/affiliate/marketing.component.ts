import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../common/api/client.service';

@Component({
  selector: 'm-affiliate--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AffiliateMarketingComponent {

  user = window.Minds.user;

  constructor(private client : Client, private cd : ChangeDetectorRef){
  }

  isAffiliate(){
    for(let program of this.user.programs){
      if(program == 'affiliate')
        return true;
    }
    return false;
  }

  join(){
    this.user.programs.push('affiliate');
    this.client.put('api/v1/monetization/affiliates');
    this.detectChanges();
  }

  detectChanges(){
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
