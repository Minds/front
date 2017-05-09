import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Client, Upload } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';

@Component({
  moduleId: module.id,
  selector: 'minds-wallet-merchants',
  templateUrl: 'merchants.html'
})

export class Merchants {

  session = SessionFactory.build();
  ts : number = Date.now();

  user = window.Minds.user;
  merchant: any;
  status : string = "pending";
  sales : Array<any> = [];

  statusInProgress: boolean = false;
  loaded: boolean = false;
  isMerchant: boolean = false;
  canBecomeMerchant: boolean = false;

  inProgress : boolean = false;
  updating : boolean = false;
  confirmation : boolean = false;
  error : string = "";

  exclusive = {
    enabled : false,
    amount: 10,
    intro: '',
    saving: false,
    saved: false
  };

  minds = window.Minds;

  constructor(public client: Client, public upload : Upload, public fb: FormBuilder){
  }

  ngOnInit() {
    this.load()
      .then((response: any) => {
        this.loaded = true;
        this.canBecomeMerchant = response.canBecomeMerchant;

        if (this.canBecomeMerchant) {
          this.setUp();
        }
      });
  }

  load(): Promise<any> {
    this.statusInProgress = true;

    return this.client.get('api/v1/merchant/status')
      .then((response: any) => {
        this.statusInProgress = false;
        return response;
      })
      .catch(e => {
        this.statusInProgress = false;
        throw e;
      });
  }

  setUp() {
    if(this.user.merchant && this.user.merchant.service == 'stripe' && this.user.merchant.id){
      this.isMerchant = true;
      this.getSettings();
      this.getSales();
    }

    if(this.user.merchant.exclusive){
      this.exclusive = this.user.merchant.exclusive;
    }
  }

  onboarded(response) {
    this.isMerchant = true;

    this.user.merchant = {
      id: response.id,
      service: 'stripe',
      status: 'awaiting-document',
      exclusive: {
        enabled: true,
        amount: 10
      }
    };

    this.exclusive.enabled = true;
    this.status = 'awaiting-document';

    this.getSettings();
  }

  updated(response) {
    this.isMerchant = true;
    this.confirmation = true;
    this.updating = false;
    this.minds.user.merchant.status = 'active';
    this.status = 'active';

    this.getSettings()
      .then(() => {
        this.minds.user.merchant.status = 'active';
        this.status = 'active';
      });
  }

  getSettings(){
    this.inProgress = true;
    return this.client.get('api/v1/merchant/settings')
      .then((response : any) => {
        this.status = response.merchant.status;
        this.merchant = response.merchant;
        this.inProgress = false;

        if (!response.merchant.verified) {
          this.status = 'awaiting-document';
        }
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  getSales(){
    var self = this;
    this.client.get('api/v1/merchant/sales')
      .then((response : any) => {
        self.sales = response.sales;
      });
  }

  charge(sale){
    var self = this;
    this.client.post('api/v1/merchant/charge/' + sale.id)
      .then((response : any) => {

      });
  }

  uploadDocument(input: HTMLInputElement) {

    let file = input ? input.files[0] : null;

    this.upload.post('api/v1/merchant/verification', [ file ], {},
      (progress) => {
        console.log(progress);
      })
      .then((response: any) => {
        this.status = 'active';
        input.value = null;
      })
      .catch((e) => {
        alert('Sorry, there was a problem. Try again.');
        input.value = null;
      });
  }

  updatePreview(input: HTMLInputElement) {

    let file = input ? input.files[0] : null;

    var reader  = new FileReader();
    reader.onloadend = () => {
      input.src = reader.result;
    }
    reader.readAsDataURL(file);

  }

  uploadPreview(input: HTMLInputElement) {

    let file = input ? input.files[0] : null;

    this.upload.post('api/v1/merchant/exclusive-preview', [ file ], {},
      (progress) => {
        console.log(progress);
      })
      .then((response: any) => {
        input.value = null;
      })
      .catch((e) => {
        alert('Sorry, there was a problem. Try again.');
        input.value = null;
      });
  }

  saveExclusive(){
    this.exclusive.saved = false;
    this.exclusive.saving = true;
    this.client.post('api/v1/merchant/exclusive', this.exclusive)
      .then(() => {
        this.minds.user.merchant.exclusive = this.exclusive;
        this.exclusive.saved = true;
        this.exclusive.saving = false;
      });
  }


}
