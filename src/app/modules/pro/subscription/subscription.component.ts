import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Session } from '../../../services/session';
import { ProService } from '../pro.service';
import { WireCreatorComponent } from '../../wire/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { EntitiesService } from '../../../common/services/entities.service';

@Component({
  selector: 'm-pro--subscription',
  templateUrl: 'subscription.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProSubscriptionComponent implements OnInit {
  @Output() onEnable: EventEmitter<any> = new EventEmitter();

  @Output() onDisable: EventEmitter<any> = new EventEmitter();

  isLoggedIn: boolean = false;

  inProgress: boolean = false;

  active: boolean;

  criticalError: boolean = false;

  error: string = '';

  minds = window.Minds;

  constructor(
    protected service: ProService,
    protected session: Session,
    protected overlayModal: OverlayModalService,
    protected entities: EntitiesService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.session.isLoggedIn();

    if (this.isLoggedIn) {
      this.load();
    }
  }

  async load() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      this.active = await this.service.isActive();
    } catch (e) {
      this.criticalError = true;
      this.error = (e && e.message) || 'Unknown error';
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async enable() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      const proHandler = ((await this.entities
        .setCastToActivities(false)
        .fetch([`urn:user:${this.minds.handlers.pro}`])) as any).entities[0];

      this.overlayModal
        .create(WireCreatorComponent, proHandler, {
          onComplete: () => {
            this.active = true;
            this.minds.user.pro = true;
            this.onEnable.emit(Date.now());
            this.inProgress = false;
            this.detectChanges();
          },
        })
        .onDidDismiss(() => {
          this.inProgress = false;
          this.detectChanges();
        })
        .present();
    } catch (e) {
      this.active = false;
      this.minds.user.pro = false;
      this.error = (e && e.message) || 'Unknown error';
      this.inProgress = false;
    }

    this.detectChanges();
  }

  async disable() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      await this.service.disable();
      this.active = false;
      this.minds.user.pro = false;
      this.onDisable.emit(Date.now());
    } catch (e) {
      this.active = true;
      this.minds.user.pro = true;
      this.error = (e && e.message) || 'Unknown error';
    }

    this.inProgress = false;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
