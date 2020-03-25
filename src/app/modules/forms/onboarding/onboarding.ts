import { Component, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-form-onboarding',
  outputs: ['done'],
  templateUrl: 'onboarding.html',
})
export class OnboardingForm {
  error: string = '';
  inProgress: boolean = false;
  referrer: string;

  form: FormGroup;
  gender: string = 'private';
  banner: string;

  done: EventEmitter<any> = new EventEmitter();

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      briefdescription: [''],
      dob: [''],
      city: [''],
    });
  }

  submit(e) {
    e.preventDefault();
    this.inProgress = true;

    let info = this.form.value;
    info.gender = this.gender;

    this.client
      .post('api/v1/channel/info', info)
      .then((data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

        this.inProgress = false;

        this.done.next(data.user);
      })
      .catch(e => {
        console.log(e);
        this.inProgress = false;

        return;
      });
  }

  addAvatar(file) {
    console.log(file);
    this.upload
      .post('api/v1/channel/avatar', [file], { filekey: 'file' })
      .then((response: any) => {
        this.session.getLoggedInUser().icontime = Date.now();
      });
  }

  addBanner(e) {
    var element: any = e.target ? e.target : e.srcElement;
    var file = element ? element.files[0] : null;

    var reader = new FileReader();
    reader.onloadend = () => {
      this.banner =
        typeof reader.result === 'string'
          ? reader.result
          : reader.result.toString();
    };
    reader.readAsDataURL(file);

    this.upload.post('api/v1/channel/carousel', [file], { top: 0 });
  }
}
