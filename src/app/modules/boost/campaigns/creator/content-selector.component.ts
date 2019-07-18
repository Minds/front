import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CampaignType } from '../campaigns.type';
import { CampaignContentsService } from '../campaign-contents.service';
import { Session } from '../../../../services/session';

@Component({
  providers: [CampaignContentsService],
  selector: 'm-boost-campaigns-creator--content-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'content-selector.component.html',
})
export class BoostCampaignsCreatorContentSelectorComponent implements OnInit {

  type: CampaignType;

  @Input('type') set _type(type: CampaignType) {
    this.type = type;

    if (this.initialized) {
      this.search();
    }
  }

  @Input() content: string[];

  @Input() readonly: boolean;

  @Output() contentChange: EventEmitter<string[]> = new EventEmitter();

  query: string = '';

  result: any;

  inProgress: boolean = false;

  protected initialized: boolean = false;

  constructor(
    protected contentsService: CampaignContentsService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    if (this.content && this.content.length > 0) {
      this.query = this.content[0];
    }

    this.search();

    this.initialized = true;
  }

  async search($event?) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    this.inProgress = true;
    this.result = void 0;
    this.emit([]);
    this.detectChanges();

    try {
      const result = await this.contentsService.getContent(this.type, this.query);

      this.result = result || void 0;
      this.emit(this.result && this.result.urn ? [this.result.urn] : []);
    } catch (e) {
      this.result = void 0;
      this.emit([]);

      console.error('BoostCampaignsCreatorContentSelectorComponent', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  searchUser() {
    const user = this.session.getLoggedInUser();

    this.query = `urn:entity:${user.guid}`;
    this.search();
  }

  get username() {
    const user = this.session.getLoggedInUser();
    return user && user.username;
  }

  emit(content: string[]) {
    if (!this.readonly) {
      this.contentChange.emit(content);
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

