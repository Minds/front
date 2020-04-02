import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { ACCESS, LICENSES } from '../../../services/list-options';
import { ThumbnailEvent } from '../components/thumbnail-selector.component';
import { InlineEditorComponent } from '../../../common/components/editors/inline-editor.component';
import { RecommendedService } from '../components/video/recommended.service';

@Component({
  moduleId: module.id,
  selector: 'm-media--edit',
  templateUrl: 'edit.component.html',
  providers: [
    {
      provide: RecommendedService,
      useFactory: RecommendedService._,
      deps: [Client],
    },
  ],
})
export class MediaEditComponent {
  guid: string;
  entity: any = {
    title: '',
    description: '',
    subtype: '',
    license: 'all-rights-reserved',
    nsfw: [],
  };
  inProgress: boolean;
  error: string;

  licenses = LICENSES;
  access = ACCESS;

  @ViewChild('inlineEditor', { static: true })
  inlineEditor: InlineEditorComponent;

  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
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
    this.client
      .get('api/v1/entities/entity/' + this.guid, { children: false })
      .then((response: any) => {
        this.inProgress = false;
        console.log(response);
        if (response.entity) {
          if (!response.entity.description) response.entity.description = '';

          if (!response.entity.license)
            response.entity.license = 'all-rights-reserved';

          response.entity.mature =
            response.entity.flags && response.entity.flags.mature ? 1 : 0;

          this.entity.nsfw = response.entity.nsfw;
          this.entity = response.entity;
        }
      });
  }

  save() {
    this.inlineEditor.prepareForSave().then(() => {
      this.client
        .post('api/v1/media/' + this.guid, this.entity)
        .then((response: any) => {
          console.log(response);
          this.router.navigate(['/media', this.guid]);
        })
        .catch(e => {
          this.error = 'There was an error while trying to update';
        });
    });
  }

  setThumbnail(file: ThumbnailEvent) {
    console.log(file);
    this.entity.file = file.source;
    this.entity.thumbnail = file.seconds;
  }

  /**
   * Sets this blog NSFW.
   * @param { array } nsfw - Numerical indexes for reasons in an array e.g. [1, 2].
   */
  onNSFWSelections(nsfw) {
    this.entity.nsfw = nsfw.map(reason => reason.value);
  }
}
