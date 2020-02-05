import { Component, OnInit } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from '../../../common/services/meta.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-helpdesk--questions',
  templateUrl: 'questions.component.html',
})
export class QuestionsComponent implements OnInit {
  question: any = {};

  readonly cdnAssetsUrl: string;

  constructor(
    public client: Client,
    public session: Session,
    public router: Router,
    private route: ActivatedRoute,
    private metaService: MetaService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.load(params['uuid']);
    });
  }

  async load(uuid: string) {
    this.question = {};

    try {
      const response: any = await this.client.get(
        `api/v2/helpdesk/questions/question/${uuid}`
      );
      this.question = response.question;
      this.metaService
        .setTitle(this.question.question)
        .setDescription(this.question.answer)
        .setOgImage('/assets/photos/balloon.jpg');
    } catch (e) {
      console.error(e);
    }
  }

  hasVoted(direction: 'up' | 'down') {
    return this.question[`thumb_${direction}`] === true;
  }

  async castVote(direction: 'up' | 'down') {
    const key = `thumb_${direction}`;
    this.question[key] = !this.question[key];

    try {
      if (this.question[key]) {
        await this.client.put(
          `api/v2/helpdesk/questions/${this.question.uuid}/${direction}`
        );
      } else {
        await this.client.delete(
          `api/v2/helpdesk/questions/${this.question.uuid}/${direction}`
        );
      }
    } catch (e) {
      console.error(e);
      this.question[key] = !this.question[key];
    }
  }

  async delete() {
    try {
      if (confirm('Are you sure to delete ' + this.question['uuid'])) {
        await this.client.delete(
          `api/v2/admin/helpdesk/questions/${this.question['uuid']}`
        );
        this.router.navigate(['/help']);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
