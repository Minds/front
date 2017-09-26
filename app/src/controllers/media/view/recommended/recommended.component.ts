import { Component, Input } from '@angular/core';
import { Client } from '../../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-media-recommended',
  templateUrl: 'recommended.component.html'
})
export class MediaViewRecommended {
  @Input() limit: string | number;

  @Input('opts') set _opts({ current, next, channel, type }) {
    this.current = current || '';
    this.next = next || '';
    this.channel = channel;
    this.type = type;

    if (this.initialized) {
      this.load(true);
    }
  }

  current: string | number;
  next: string | number;
  channel: string | number;
  type: string;

  entities: any[] = [];

  private initialized: boolean = false;
  private loaded: boolean = false;

  constructor(private client: Client) { }

  ngOnInit() {
    this.initialized = true;
    this.load(true);
  }

  load(refresh: boolean = false) {
    if (this.loaded && !refresh) {
      return;
    }

    this.loaded = true;

    this.client.get(`api/v1/media/recommended/${this.type}/${this.channel}`, {
      current: this.current,
      next: this.next,
      limit: this.limit
    })
      .then(({ entities }) => {
        if (!entities) {
          this.entities = [];
          return;
        }

        this.entities = entities;
      });
  }
}
