import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GroupsService } from '../groups.service';

import { Session } from '../../../services/session';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Form for creating a new group.
 *
 * See it by clicking "Groups" in the sidebar, then the "Create Group" button
 */
@Component({
  moduleId: module.id,
  selector: 'minds-groups-create',
  templateUrl: 'create.html',
})
export class GroupsCreator {
  banner: File;
  avatar: File;

  inProgress: boolean = false;

  form: UntypedFormGroup;
  bannerAssetCssUrl: string;
  avatarAssetCssUrl: string;

  constructor(
    public session: Session,
    public service: GroupsService,
    public router: Router,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
      description: new UntypedFormControl(''),
      membership: new UntypedFormControl('2', {
        validators: [Validators.required],
      }),
    });
  }

  addBanner(fileInput: HTMLInputElement) {
    const file = fileInput.files.item(0);

    if (!file) {
      return;
    }

    this.banner = file;
    this.bannerAssetCssUrl = `url(${URL.createObjectURL(this.banner)})`;
  }

  addAvatar(fileInput: HTMLInputElement) {
    const file = fileInput.files.item(0);

    if (!file) {
      return;
    }

    this.avatar = file;
    this.avatarAssetCssUrl = `url(${URL.createObjectURL(this.avatar)})`;
  }

  async onSubmit(e) {
    const values = this.form.value;
    if (!values.name) {
      this.toasterService.error('Your group must have a name');
      return;
    }

    values.briefdescription = values.description;

    this.inProgress = true;

    try {
      const guid = await this.service.save(values);

      await this.service.upload(
        {
          guid,
          banner_position: 0,
        },
        {
          banner: this.banner,
          avatar: this.avatar,
        }
      );

      this.service.updateMembership(true, guid);
      this.router.navigate(['/group', guid]);
    } catch (e) {
      this.inProgress = false;
      this.toasterService.error(e.message);
    }
  }
}
