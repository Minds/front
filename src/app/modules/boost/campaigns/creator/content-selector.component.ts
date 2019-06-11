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

@Component({
  providers: [CampaignContentsService],
  selector: 'm-boost-campaigns-creator--content-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'content-selector.component.html',
})
export class BoostCampaignsCreatorContentSelectorComponent implements OnInit {

  type: CampaignType

  @Input('type') set _type(type: CampaignType) {
    this.type = type;

    if (this.initialized) {
      this.search();
    }
  }

  @Input() content: string[];

  @Output() contentChange: EventEmitter<string[]> = new EventEmitter();

  query: string = '';

  result: any;

  inProgress: boolean = false;

  protected initialized: boolean = false;

  constructor(
    protected contentsService: CampaignContentsService,
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

  async search() {
    this.inProgress = true;
    this.result = void 0;
    this.contentChange.emit([]);
    this.detectChanges();

    try {
      const result = await this.contentsService.getContent(this.type, this.query);

      this.result = result || void 0;
      this.contentChange.emit(this.result && this.result.urn ? [this.result.urn] : []);
    } catch (e) {
      this.result = void 0;
      this.contentChange.emit([]);

      console.error('BoostCampaignsCreatorContentSelectorComponent', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

