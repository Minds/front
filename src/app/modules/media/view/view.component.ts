import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

import { RecommendedService } from '../components/video/recommended.service';
import { AttachmentService } from '../../../services/attachment';
import { ContextService } from '../../../services/context.service';
import { MindsTitle } from '../../../services/ux/title';

@Component({
  moduleId: module.id,
  selector: 'm-media--view',
  templateUrl: 'view.component.html',
  providers: [{
    provide: RecommendedService,
    useFactory: RecommendedService._,
    deps: [Client]
  }],
})

export class MediaViewComponent {

  minds = window.Minds;
  guid: string;
  entity: any = {};
  inProgress: boolean = true;
  error: string = '';
  deleteToggle: boolean = false;

  theaterMode: boolean = false;

  menuOptions: Array<string> = ['edit', 'follow', 'feature', 'delete', 'report', 'set-explicit', 'subscribe', 'remove-explicit', 'rating'];

  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public router: Router,
    public title: MindsTitle,
    public route: ActivatedRoute,
    public attachment: AttachmentService,
    public context: ContextService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.title.setTitle('');

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.guid = params['guid'];
        this.load(true);
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(refresh: boolean = false) {
    if (refresh) {
      this.entity = {};
      this.detectChanges();
    }
    this.inProgress = true;
    this.client.get('api/v1/media/' + this.guid, { children: false })
      .then((response: any) => {
        this.inProgress = false;
        if (response.entity.type !== 'object') {
          return;
        }
        if (response.entity) {
          this.entity = response.entity;

          switch (this.entity.subtype) {
            case 'video':
              this.context.set('object:video');
              break;

            case 'image':
              this.context.set('object:image');
              break;

            default:
              this.context.reset();
          }

          if (this.entity.title) {
            this.title.setTitle(this.entity.title);
          }
        }

        this.detectChanges();
      })
      .catch((e) => {
        this.inProgress = false;
        this.error = 'Sorry, there was problem.';
      });
  }

  delete() {
    this.client.delete('api/v1/media/' + this.guid)
      .then((response: any) => {
        const type: string = this.entity.subtype === 'video' ? 'videos': 'images';
        this.router.navigate([`/media/${type}/my`]);
      })
      .catch(e => {
        alert((e && e.message) || 'Server error');
      });
  }

  getNext() {
    if (this.entity.container_guid === this.entity.owner_guid
      || !this.entity.album_children_guids
      || this.entity.album_children_guids.length <= 1) {
      return;
    }

    let pos = this.entity['album_children_guids'].indexOf(this.entity.guid);
    //bump up if less than 0
    if (pos <= 0)
      pos = 1;
    //bump one up if we are in the same position as ourself
    if (this.entity['album_children_guids'][pos] === this.entity.guid)
      pos++;
    //reset back to 0 if we are are the end
    if (pos >= this.entity['album_children_guids'].length)
      pos = 0;

    return this.entity['album_children_guids'][pos];
  }

  menuOptionSelected(option: string) {
    switch (option) {
      case 'edit':
        this.router.navigate(['/media/edit', this.entity.guid]);
        break;
      case 'delete':
        this.delete();
        break;
      case 'set-explicit':
        this.setExplicit(true);
        break;
      case 'remove-explicit':
        this.setExplicit(false);
        break;

    }
  }

  setExplicit(value: boolean) {

    this.entity.mature = value;
    this.detectChanges();

    this.client.post(`api/v1/entities/explicit/${this.entity.guid}`, { value: value ? '1': '0' })
      .catch(e => {
        this.entity.mature = !!this.entity.mature;
        this.detectChanges();
      });
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
