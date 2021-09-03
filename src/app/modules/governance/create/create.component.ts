import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormToastService } from '../../../common/services/form-toast.service';
import { Session } from '../../../services/session';
import { ComposerService } from '../../composer/services/composer.service';
import { SettingsV2Service } from '../../settings-v2/settings-v2.service';
import { SnapshotProposal, SnapshotService } from '../snapshot.service';

export enum PROPOSAL_CHOICE {
  APPROVE = 'approve',
  REJECT = 'reject',
}

@Component({
  moduleId: module.id,
  selector: 'm-governance--create',
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernanceCreateComponent implements OnInit {
  form: FormGroup;
  inProgress = false;
  userData;
  @Output('onPost') onPostEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private toasterService: FormToastService,
    public session: Session,
    private router: Router,
    private settingsV2Service: SettingsV2Service,
    private snapshotService: SnapshotService,
    protected service: ComposerService
  ) {}

  async ngOnInit() {
    this.form = new FormGroup({
      question: new FormControl('', {
        validators: [Validators.required],
      }),
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
    console.log(this.userData);
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

    values.username = this.userData.username;
    values.name = this.userData.name;
    values.email = this.userData.email;

    this.inProgress = true;

    try {
      const start = this.formatDatetime(new Date().getTime());
      const end = this.formatDatetime(new Date().getTime() + 3600 * 24 * 14);

      const body = [
        '## Project Description',
        values.project_description,
        '## Roadmap',
        values.roadmap,
        '## Funding',
        values.funding,
        '## Challenges',
        values.challenges,
        '## Links',
        values.links,
        '## Experience',
        values.experience,
        '## Goals',
        values.goals,
        '## Additional requests',
        values.additional_requests,
        '## Additional information',
        values.additional_info,
      ].join('\n');

      this.service.message$.next(body);
      this.service.title$.next(values.question);

      const data = await this.snapshotService.createProposal({
        end,
        start,
        body,
        name: values.question,
        choices: [PROPOSAL_CHOICE.APPROVE, PROPOSAL_CHOICE.REJECT],
      });
      const activity = await this.service.postProposal();
      this.onPostEmitter.next(activity);
      await this.router.navigate([`/governance/proposal/${data.id}`]);
      this.toasterService.success('Proposal successfully submitted');
    } catch (e) {
      this.inProgress = false;
      this.toasterService.error(e.message);
    }
  }

  private formatDatetime(time: number): number {
    return Math.floor(time / 1000);
  }
}
