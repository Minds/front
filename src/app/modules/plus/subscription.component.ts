import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../common/api/client.service';

@Component({
  selector: 'm-plus--subscription',
  templateUrl: 'subscription.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlusSubscriptionComponent {

  user = window.Minds.user;
  source: string;
  error: string;
  inProgress: boolean = true;
  completed: boolean = false;
  active: boolean = false;

  constructor(private client: Client, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.load()
      .then(() => {
        this.inProgress = false;
        this.detectChanges();
      });
  }

  load(): Promise<any> {
    return this.client.get('api/v1/plus')
      .then(({ active }) => {
        if (active)
          this.active = true;
        return active;
      })
      .catch(e => {
        throw e;
      });
  }

  isPlus() {
    if (this.user.plus)
      return true;
    return false;
  }

  setSource(source: string) {
    this.source = source;
    this.purchase();
  }

  purchase() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();
    this.client.post('api/v1/plus/subscription', {
      source: this.source
    })
      .then((response: any) => {
        this.inProgress = false;
        this.source = '';
        this.completed = true;
        this.user.plus = true;
        this.detectChanges();
      })
      .catch((e) => {
        this.inProgress = false;
        this.source = '';
        this.error = e.message;
        this.detectChanges();
      });
  }

  cancel() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();
    return this.client.delete('api/v1/plus/subscription')
      .then((response: any) => {
        this.inProgress = false;
        this.user.plus = false;
        this.active = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
