import { Component, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { DiscoveryTagSettingsComponent } from './settings.component';

@Component({
  selector: 'm-discovery__tags',
  templateUrl: './tags.component.html',
})
export class DiscoveryTagsComponent {
  tags$: Observable<any> = this.service.tags$;
  trending$: Observable<any> = this.service.trending$;
  inProgress$: Observable<boolean> = this.service.inProgress$;

  constructor(
    private service: DiscoveryTagsService,
    private overlayModal: OverlayModalService,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.service.loadTags();
  }
}
