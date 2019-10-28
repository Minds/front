import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MindsTitle } from '../../../services/ux/title';

@Component({
  selector: 'm-marketing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'marketing.component.html',
})
export class MarketingComponent implements OnInit {
  @Input() pageTitle: string = '';

  constructor(protected title: MindsTitle) {}

  ngOnInit() {
    if (this.pageTitle) {
      this.title.setTitle(this.pageTitle);
    }
  }
}
