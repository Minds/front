import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-ad-sharing',
  templateUrl: 'ad-sharing.component.html'
})

export class AdSharingComponent {
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
    message: ''
  };

  paramsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private client: Client,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

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
    this.detectChanges();

    this.client.get(`api/v1/monetization/ads/status`)
      .then((response: any) => {
        this.inProgress = false;
        this.loaded = true;

        this.isMerchant = !!response.isMerchant;
        this.canBecomeMerchant = !!response.canBecomeMerchant;
        this.enabled = !!response.enabled;
        this.applied = !!response.applied;
        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.detectChanges();
      });
  }

  isApplyValid() {
    return !this.applyInProgress && this.applyForm.message;
  }

  apply() {
    if (this.applyInProgress) {
      return;
    }

    this.applyInProgress = true;
    this.detectChanges();

    this.client.post(`api/v1/monetization/ads/apply`, this.applyForm)
      .then((response: any) => {
        this.applyInProgress = false;
        this.applyError = '';
        this.applied = !!response.applied;
        this.detectChanges();
      })
      .catch(e => {
        this.applyInProgress = false;
        this.applyError = e.message ? e.message : 'Unknown error';
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
