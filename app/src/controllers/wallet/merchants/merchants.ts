import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { MDL_DIRECTIVES } from '../../../directives/material';
import { InfiniteScroll } from '../../../directives/infinite-scroll';


@Component({
  selector: 'minds-wallet-merchants',
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'src/controllers/wallet/merchants/merchants.html',
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, FORM_DIRECTIVES, InfiniteScroll ]
})

export class Merchants {

  session = SessionFactory.build();

  onboardForm: ControlGroup;
  editForm: ControlGroup;

  isMerchant : boolean = false;
  status : string = "pending";
  sales : Array<any> = [];

  inProgress : boolean = false;
  updating : boolean = false;
  confirmation : boolean = false;
  error : string = "";

  minds = window.Minds;

	constructor(public client: Client, public fb: FormBuilder){
    if(this.session.getLoggedInUser().merchant && this.session.getLoggedInUser().merchant != "0"){
      this.isMerchant = true;
      this.getSettings();
      this.getSales();
    }

    this.onboardForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      dob: ['', (control) => {
        var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        return !regex.test(control.value) ? {"invalidDate": true} : null;
      }],
      ssn:  [''],
      street:  ['', Validators.required],
      city:  ['', Validators.required],
      region:  ['', Validators.required],
      postCode:  ['', Validators.required],
      venmo: [true],
      accountNumber:  [''],
      routingNumber:  ['']
    });

    this.editForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      venmo: [true],
      ssn: [''],
      accountNumber: [''],
      routingNumber: ['']
    });
	}

  onboard(form){
    var self = this;
    this.client.post('api/v1/merchant/onboard', this.onboardForm.value)
      .then((response : any) => {
        this.isMerchant = true;
        window.Minds.user.merchant = true;
      })
      .catch((e) => {
        self.error = e.message;
      });
  }

  getSettings(){
    var self = this;
    this.inProgress = true;
    this.client.get('api/v1/merchant/settings')
      .then((response : any) => {
        self.status = response.merchant.status;
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
        this.isMerchant = true;
        this.confirmation = true;
        this.updating = false;
        window.Minds.user.merchant = true;
      })
      .catch((e) => {
        this.error = e.message;
        this.confirmation = false;
        this.updating = false;
      });
  }

}
