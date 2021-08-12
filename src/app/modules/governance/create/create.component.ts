import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { FormToastService } from '../../../common/services/form-toast.service';
@Component({
  selector: 'm-governance__create',
  templateUrl: './create.component.html',
})
export class GovernanceCreateComponent implements OnInit {
  form: FormGroup;
  inProgress: boolean = false;

  constructor(
    private toasterService: FormToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required],
      }),
      username: new FormControl('', {
        validators: [Validators.required],
      }),
      name: new FormControl('', {
        validators: [Validators.required],
      }),
      experience: new FormControl(''),
      project_name: new FormControl('', {
        validators: [Validators.required],
      }),
      area: new FormControl('0', {
        validators: [Validators.required],
      }),
      project_description: new FormControl(''),
      links: new FormControl(''),
      goals: new FormControl(''),
      roadmap: new FormControl(''),
      challenges: new FormControl(''),
      funding: new FormControl(''),
      additional_requests: new FormControl(''),
      additional_info: new FormControl(''),
    });
  }

  async onSubmit(e) {
    const values = this.form.value;
    if (!values.funding) {
      this.toasterService.error('Funding field is required');
      return;
    }
    if (!values.project_description) {
      this.toasterService.error('Project description is required');
      return;
    }
    if (!values.roadmap) {
      this.toasterService.error('Please, enter the roadmap of your proposal');
      return;
    }
    if (!values.experience) {
      this.toasterService.error('Please, enter your experience');
      return;
    }

    this.inProgress = true;

    try {
      console.log(values);
      this.toasterService.success('proposal sent');
      this.router.navigate(['/governance/latest']);
    } catch (e) {
      this.inProgress = false;
      this.toasterService.error(e.message);
    }
  }
}
