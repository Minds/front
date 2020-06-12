import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ContextService } from '../../../../services/context.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GroupV2Service } from '../services/group-v2.service';
import { ActivityService } from '../../../../common/services/activity.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { VideoChatService } from '../../../videochat/videochat.service';

/**
 * Views
 */
type GroupView = 'feed' | 'chat' | 'members';

@Component({
  selector: 'm-groupProfile',
  templateUrl: 'profile.component.html',
  providers: [ActivityService],
})
export class GroupProfileComponent implements OnInit, OnDestroy {
  paramsSubscription: Subscription;
  groupSubscription: Subscription;

  editing: boolean = false;

  desktopResolution: boolean = true;

  showProfileSidebar: boolean = true;

  isGatheringActive: boolean = false;

  protected routerEvent$: Subscription;

  /**
   * Active view
   */
  readonly view$: BehaviorSubject<GroupView> = new BehaviorSubject<GroupView>(
    'feed'
  );

  constructor(
    public service: GroupV2Service,
    protected videoChatService: VideoChatService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected context: ContextService,
    protected location: Location
  ) {}

  ngOnInit() {
    this.context.set('activity');
    // this.listenForNewMessages();
    // this.detectWidth(true);
    // this.detectConversationsState();
    this.shouldShowProfileSidebar();

    this.routerEvent$ = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.shouldShowProfileSidebar();
      });

    this.paramsSubscription = this.route.params.subscribe(params => {
      this.view$.next(params['filter'] || 'feed');

      if (params['guid']) {
        const changed = params['guid'] !== this.service.guid$.getValue();

        // this.postMeta.container_guid = this.guid;

        if (changed) {
          // this.group = void 0;
          this.service.load(params['guid']);
          this.groupSubscription = this.service.group$.subscribe(
            async group => {
              if (
                this.route.snapshot.queryParamMap.has('join') &&
                confirm('Are you sure you want to join this group')
              ) {
                await this.service.join();
              }
            }
          );
        }
      }
    });

    this.detectWidth();
  }

  ngOnDestroy() {
    this.routerEvent$.unsubscribe();
  }

  toggleGathering() {
    this.isGatheringActive = !this.isGatheringActive;

    if (this.isGatheringActive) {
      this.videoChatService.activate(this.service.group$.getValue());
    } else {
      this.videoChatService.deactivate();
    }
  }

  @HostListener('window:resize')
  detectWidth() {
    this.desktopResolution = window.innerWidth > 900;
  }

  private shouldShowProfileSidebar() {
    const show = this.location.path().indexOf('/feed') !== -1;
    this.showProfileSidebar = show;
  }
}
