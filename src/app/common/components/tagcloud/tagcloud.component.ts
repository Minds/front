import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-tagcloud',
  templateUrl: 'tagcloud.component.html',
})
export class TagcloudComponent {
  tags: Array<string> = [];

  constructor(public client: Client, configs: ConfigsService) {
    this.tags = configs.get('tags');
  }
}
