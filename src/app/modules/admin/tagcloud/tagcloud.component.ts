import { Component, OnInit } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-tagcloud',
  templateUrl: 'tagcloud.component.html',
})
export class AdminTagcloud implements OnInit {
  tags: string[] = [];
  age: number | boolean = false;
  hidden: string[] = [];

  constructor(private client: Client) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.client
      .get(`api/v1/admin/tagcloud`)
      .then(
        ({
          tags,
          age,
          hidden,
        }: {
          tags: string[];
          age: number;
          hidden: string[];
        }) => {
          this.tags = tags;
          this.age = <any>age !== false ? Math.floor(age / 60) : false;
          this.hidden = hidden;
        }
      )
      .catch(e => {
        alert(`Error loading tags: ${e.message}`);
      });
  }

  hide(index: number, tag: string) {
    if (
      !confirm(
        `Are you sure you want to hide #${tag}? This hashtag won't appear again.`
      )
    ) {
      return;
    }

    this.tags.splice(index, 1);

    this.client
      .delete(`api/v1/admin/tagcloud/${tag}`)
      .then(() => {
        this.load();
      })
      .catch(e => {
        this.load();
        alert(`Error deleting #${tag}!`);
      });
  }

  unhide(index: number, tag: string) {
    if (
      !confirm(
        `Are you sure you want to unhide #${tag}? This hashtag will start appearing.`
      )
    ) {
      return;
    }

    this.hidden.splice(index, 1);

    this.client
      .put(`api/v1/admin/tagcloud/${tag}`)
      .then(() => {
        this.load();
      })
      .catch(e => {
        this.load();
        alert(`Error showing #${tag}!`);
      });
  }

  resync() {
    if (
      !confirm(`Are you sure you want to re-sync? This will wipe the caches.`)
    ) {
      return;
    }

    this.client
      .post(`api/v1/admin/tagcloud/refresh`)
      .then(() => {
        this.load();
      })
      .catch(e => {
        alert(`Error resyncing!`);
      });
  }
}
