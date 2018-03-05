import { Component } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-tagcloud',
  templateUrl: 'tagcloud.component.html'
})

export class TagcloudComponent {

  tags: Array<string> = [];

  constructor(public client: Client) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.client.get('api/v1/search/tagcloud')
      .then((response: any) => {
        this.tags = response.tags;
      });
  }

}
