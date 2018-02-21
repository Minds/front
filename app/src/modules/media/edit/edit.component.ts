import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { LICENSES, ACCESS } from '../../../services/list-options';
import { ThumbnailEvent } from '../components/thumbnail-selector.component';

@Component({
  moduleId: module.id,
  selector: 'm-media--edit',
  templateUrl: 'edit.component.html'
})

export class MediaEditComponent {

  minds;
  guid: string;
  entity: any = {
    title: '',
    description: '',
    subtype: '',
    license: 'all-rights-reserved',
    mature: false
  };
  inProgress: boolean;
  error: string;

  licenses = LICENSES;
  access = ACCESS;

  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.minds = window.Minds;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.guid = params['guid'];
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load() {
    this.inProgress = true;
    this.client.get('api/v1/entities/entity/' + this.guid, { children: false })
      .then((response: any) => {
        this.inProgress = false;
        console.log(response);
        if (response.entity) {
          if (!response.entity.description)
            response.entity.description = '';

          if (!response.entity.license)
            response.entity.license = 'all-rights-reserved';

          response.entity.mature = response.entity.flags && response.entity.flags.mature ? 1 : 0;

          this.entity = response.entity;
        }
      });
  }

  save() {
    this.client.post('api/v1/media/' + this.guid, this.entity)
      .then((response: any) => {
        console.log(response);
        this.router.navigate(['/media', this.guid]);
      })
      .catch((e) => {
        this.error = 'There was an error while trying to update';
      });
  }

  setThumbnail(file: ThumbnailEvent){
    console.log(file);
    this.entity.file = file.source;
    this.entity.thumbnail = file.seconds;
  }

}
