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

  onboardForm: FormGroup;
  editForm: FormGroup;

  user = window.Minds.user;
  isMerchant : boolean = false;
  status : string = "pending";
  sales : Array<any> = [];

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
    if(this.user.merchant && this.user.merchant.service == 'stripe' && this.user.merchant.id){
      this.isMerchant = true;
      this.getSettings();
      this.getSales();
    }

    if(this.user.merchant.exclusive){
      this.exclusive = this.user.merchant.exclusive;
    }

    this.onboardForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      state:  [''],
      ssn:  [''],
      street:  ['', Validators.required],
      city:  ['', Validators.required],
      //region:  ['', Validators.required],
      country: ['', Validators.required],
      postCode:  ['', Validators.required],
      accountNumber:  [''],
      routingNumber: [''],
      stripeAgree: ['', Validators.required],
    });

    this.editForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      //email: ['', Validators.required],
      venmo: [true],
      ssn: [''],
      accountNumber: [''],
      routingNumber: ['']
    });
	}

  onboard(form){
    this.client.post('api/v1/merchant/onboard', this.onboardForm.value)
      .then((response : any) => {
        this.isMerchant = true;
        this.user.merchant = {
          id: response.id,
          service: 'stripe',
          status: 'awaiting-document'
        };
        this.status = 'awaiting-document';
      })
      .catch((e) => {
        this.error = e.message;
      });
  }

  getSettings(){
    var self = this;
    this.inProgress = true;
    this.client.get('api/v1/merchant/settings')
      .then((response : any) => {
        this.status = response.merchant.status;
        var controls : any = self.editForm.controls;
        controls.firstName.updateValue(response.merchant.firstName);
        controls.lastName.updateValue(response.merchant.lastName);
        controls.email.updateValue(response.merchant.email);
        controls.venmo.updateValue(response.merchant.venmo);
        controls.ssn.updateValue(response.merchant.ssn);
        controls.accountNumber.updateValue(response.merchant.accountNumber);
        controls.routingNumber.updateValue(response.merchant.routingNumber);
        self.inProgress = false;
      })
      .catch((e) => {
        self.inProgress = false;
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

  update(){
    this.updating = true;
    this.error = "";
    this.client.post('api/v1/merchant/update', this.editForm.value)
      .then((response : any) => {
        if(response.error){
          this.error = response.message;
          return false;
        }
        this.isMerchant = true;
        this.confirmation = true;
        this.updating = false;
        this.minds.user.merchant.status = 'active';
        this.status = 'active';
      })
      .catch((e) => {
        this.error = e.message;
        this.confirmation = false;
        this.updating = false;
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
