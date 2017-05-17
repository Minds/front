import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-wallet-ad-sharing',
  templateUrl: 'ad-sharing.component.html'
})

export class WalletAdSharing {
  type: string = 'analytics';

  inProgress: boolean = false;
  loaded: boolean = false;
  remote: boolean = false;
  isMerchant: boolean = false;
  canBecomeMerchant: boolean = false;
  
  enabled: boolean = false;
  applied: boolean = false;

  applyInProgress: boolean = false;
  applyError: string = '';
  applyForm = { // @todo: implement FormBuilder when checkboxes validation work
    enabled: '',
    message: '',
    agree: '',
  };

  constructor(private route: ActivatedRoute, private client: Client, public fb: FormBuilder) { }

  paramsSubscription: Subscription;
  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['type']) {
        this.type = params['type'];
      }

      this.remote = (typeof params['username'] !== 'undefined');
    });

    if (!this.remote) {
      this.load();
    }
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load() {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    this.client.get(`api/v1/monetization/ads/status`)
      .then((response: any) => {
        this.inProgress = false;
        this.loaded = true;

        this.isMerchant = !!response.isMerchant;
        this.canBecomeMerchant = !!response.canBecomeMerchant;
        this.enabled = !!response.enabled;
        this.applied = !!response.applied;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  isApplyValid() {
    return !this.applyInProgress &&
      this.applyForm.enabled &&
      this.applyForm.message &&
      this.applyForm.agree;
  }

  apply() {
    if (this.applyInProgress) {
      return;
    }

    this.applyInProgress = true;

    this.client.post(`api/v1/monetization/ads/apply`, this.applyForm)
      .then((response: any) => {
        this.applyInProgress = false;
        this.applyError = '';
        this.applied = !!response.applied;
      })
      .catch(e => {
        this.applyInProgress = false;
        this.applyError = e.message ? e.message : 'Unknown error';
      });
  }
}
