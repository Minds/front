import {
  Component,
  HostListener,
  ViewChild,
  Input,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService, ActivityEntity } from '../activity.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { MindsUser, MindsGroup } from '../../../../interfaces/entities';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../media/modal/modal.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'm-activity__remind',
  templateUrl: 'remind.component.html',
  providers: [ActivityService],
})
export class ActivityRemindComponent {
  @Input('entity') set entity(entity: ActivityEntity) {
    this.service.setEntity(entity.remind_object);
  }
  constructor(public service: ActivityService) {}
}
