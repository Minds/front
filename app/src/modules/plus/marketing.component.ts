import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../common/api/client.service';

@Component({
  selector: 'm-plus--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlusMarketingComponent {

  user = window.Minds.user;
  showSubscription: boolean = false;
  showVerify: boolean = false;

  constructor(private client : Client, private cd : ChangeDetectorRef){
  }

  ngOnInit(){
    this.load();
  }

  load(): Promise<any> {
    return this.client.get('api/v1/plus')
      .then((response: any) => {
        console.log(response);
        return response;
      })
      .catch(e => {
        throw e;
      });
  }

  isPlus(){
    if(this.user.plus)
      return true;
    return false;
  }

  openSubscription(){
    this.showSubscription = true;
    this.detectChanges();
  }

  detectChanges(){
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
