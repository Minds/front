import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Session, SessionFactory } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api/client';
import { ReportCreatorComponent } from '../../../modules/report/creator/creator.component';


type Option =
  'edit'
  | 'translate'
  | 'share'
  | 'mute'
  | 'unmute'
  | 'feature'
  | 'unfeature'
  | 'delete'
  | 'report'
  | 'set-explicit'
  | 'remove-explicit';

@Component({
  moduleId: module.id,
  selector: 'm-post-menu',
  templateUrl: 'post-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PostMenuComponent {
  @Input() entity: any;
  @Input() options: Array<Option>;
  @Output() optionSelected: EventEmitter<Option> = new EventEmitter<Option>();
  @Input() canDelete: boolean = false;
  @Input() isTranslatable: boolean = false;

  asyncMute: boolean = false;
  asyncMuteInProgress: boolean = false;

  opened: boolean = false;

  session: Session = SessionFactory.build();

  shareToggle: boolean = false;
  deleteToggle: boolean = false;

  constructor(private client: Client, private cd: ChangeDetectorRef, private overlayModal: OverlayModalService) {
  }

  cardMenuHandler() {
    this.opened = !this.opened;
    this.asyncMuteFetch();
  }

  asyncMuteFetch() {
    if (this.asyncMute || this.asyncMuteInProgress) {
      return;
    }

    this.asyncMuteInProgress = true;
    this.detectChanges();

    this.client.get(`api/v1/entities/notifications/${this.entity.guid}`)
      .then((response: any) => {
        this.asyncMuteInProgress = false;
        this.asyncMute = true;

        this.entity['is:muted'] = !!response['is:muted'];
        this.detectChanges();
      })
      .catch(e => {
        this.asyncMuteInProgress = false;
        this.detectChanges();
      });
  }

  mute() {
    this.entity['is:muted'] = true;

    this.client.post(`api/v1/entities/notifications/${this.entity.guid}/mute`)
      .then((response: any) => {
        if (response.done) {
          this.entity['is:muted'] = true;
          this.detectChanges();
          return;
        }

        throw new Error('E_NOT_DONE');
      })
      .catch(e => {
        this.entity['is:muted'] = false;
        this.detectChanges();
      });

    this.selectOption('mute');
  }

  unmute() {
    this.entity['is:muted'] = false;

    this.client.post(`api/v1/entities/notifications/${this.entity.guid}/unmute`)
      .then((response: any) => {
        if (response.done) {
          this.entity['is:muted'] = false;
          this.detectChanges();
          return;
        }

        throw new Error('E_NOT_DONE');
      })
      .catch(e => {
        this.entity['is:muted'] = true;
        this.detectChanges();
      });
    this.selectOption('unmute');
  }

  share() {
    this.shareToggle = true;
    this.selectOption('share');
  }

  feature() {
    this.entity.featured = true;

    this.client.put('api/v1/admin/feature/' + this.entity.guid)
      .catch(() => {
        this.entity.featured = false;
        this.detectChanges();
      });
    this.selectOption('feature');
  }

  unFeature() {
    this.entity.featured = false;

    this.client.delete('api/v1/admin/feature/' + this.entity.guid)
      .catch(() => {
        this.entity.featured = true;
        this.detectChanges();
      });
    this.selectOption('unfeature');
  }

  delete() {
    this.selectOption('delete');
  }

  report() {
    this.overlayModal.create(ReportCreatorComponent, this.entity)
      .present();
    this.selectOption('report');
  }

  setExplicit(explicit: boolean) {
    this.selectOption(explicit ? 'set-explicit' : 'remove-explicit');
  }

  selectOption(option: Option) {
    this.optionSelected.emit(option);
    this.opened = false;

    this.detectChanges();
  }


  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
