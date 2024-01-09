import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DiscoveryTagsService } from './tags.service';
import { ActivatedRoute } from '@angular/router';
import { DiscoveryTagSettingsComponent } from './settings.component';
import { DiscoveryService } from '../discovery.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-discovery__tags',
  templateUrl: './tags.component.html',
})
export class DiscoveryTagsComponent implements OnInit, OnDestroy {
  tags$: Observable<any> = this.service.tags$;
  trending$: Observable<any> = this.service.trending$;
  inProgress$: Observable<boolean> = this.service.inProgress$;

  parentPathSubscription: Subscription;
  parentPath: string = '';

  constructor(
    public route: ActivatedRoute,
    private service: DiscoveryTagsService,
    private injector: Injector,
    private discoveryService: DiscoveryService,
    protected permissions: PermissionsService,
    private composerModal: ComposerModalService,
    private toaster: ToasterService,
    protected session: Session
  ) {}

  ngOnInit() {
    this.service.loadTags();

    this.parentPathSubscription = this.discoveryService.parentPath$.subscribe(
      parentPath => {
        this.parentPath = parentPath;
      }
    );
  }

  ngOnDestroy() {
    this.parentPathSubscription.unsubscribe();
  }

  /**
   * Open composer modal
   * @returns { Promise<void> } - awaitable.
   */
  public async openComposerModal(): Promise<void> {
    try {
      await this.composerModal
        .setInjector(this.injector)
        .onPost(activity => {
          this.toaster.success(
            "Nice! If you added hashtags to your post, they'll show up in the sidebar in a few minutes"
          );
        })
        .present();
    } catch (e) {
      console.error(e);
    }
  }
}
