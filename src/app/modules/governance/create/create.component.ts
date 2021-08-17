import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { FormToastService } from '../../../common/services/form-toast.service';
import { Session } from '../../../services/session';
import { SettingsV2Service } from '../../settings-v2/settings-v2.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ShareModalComponent } from '../../modals/share/share';
@Component({
  moduleId: module.id,
  selector: 'm-governance__create',
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernanceCreateComponent implements OnInit {
  form: FormGroup;
  inProgress: boolean = false;
  userData;

  constructor(
    private toasterService: FormToastService,
    public session: Session,
    private router: Router,
    private overlayModal: OverlayModalService,
    private settingsV2Service: SettingsV2Service
  ) {}

  async ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(''),
      username: new FormControl(''),
      name: new FormControl(''),
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

    this.userData = await this.settingsV2Service.loadSettings(
      this.session.getLoggedInUser().guid
    );
  }

  openShareModal() {
    const data = {
      url: 'www.google.com',
    };

    console.log('se abre');
    this.overlayModal
      .create(ShareModalComponent, data, {
        class: 'm-overlay-modal--medium m-overlayModal__share',
      })
      .present();
  }

  async onSubmit(e) {
    console.log(this.userData);
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

    values.username = this.userData.username;
    values.name = this.userData.name;
    values.email = this.userData.email;

    this.inProgress = true;

    try {
      console.log(values);
      this.toasterService.success('proposal sent');
      this.openShareModal();
      // this.router.navigate(['/governance/latest']);
    } catch (e) {
      this.inProgress = false;
      this.toasterService.error(e.message);
    }
  }
}
