import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/angular2';
import { RouterLink } from "angular2/router";
import { Client } from 'src/services/api';
import { SessionFactory } from 'src/services/session';
import { WalletService } from 'src/services/wallet';
import { Storage } from 'src/services/storage';
import { MDL_DIRECTIVES } from 'src/directives/material';
import { InfiniteScroll } from 'src/directives/infinite-scroll';


@Component({
  selector: 'minds-wallet-merchants',
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'templates/wallet/merchants/merchants.html',
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
  confirmation : boolean = false;
  error : string = "";

  minds = window.Minds;

	constructor(public client: Client, public fb: FormBuilder){
    if(this.session.getLoggedInUser().merchant){
      this.isMerchant = true;
      this.getSettings();
      this.getSales();
    }

    this.onboardForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      dob: ['', Validators.required],
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
      })
      .catch((e) => {
        self.error = e.message;
      });
  }

  getSettings(){
    var self = this;
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
    console.log(this.editForm.value);
  }

}
