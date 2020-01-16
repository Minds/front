import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'm-marketing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'marketing.component.html',
})
export class MarketingComponent implements OnInit {
  @Input() pageTitle: string = '';

  constructor(protected metaService: MetaService) {}

  ngOnInit() {
    if (this.pageTitle) {
      this.metaService.setTitle(this.pageTitle);
    }
  }
}
