import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';

/**
 * Displays a stripped-down activity (e.g. without toolbar action buttons or comments) within an activity, with the quoted content on top.
 */
@Component({
  selector: 'm-activityV2__quote',
  templateUrl: 'quote.component.html',
  styleUrls: ['quote.component.ng.scss'],
  providers: [ActivityService],
})
export class ActivityV2QuoteComponent implements OnInit, OnDestroy {
  @HostBinding('class.m-activity__quote--minimalMode')
  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  @Input('entity') set entity(entity: ActivityEntity) {
    this.service.setEntity(entity.remind_object);
    this.service.isNsfwConsented$.next(true); // Parent entity should have done this

    this.quotedEntity = entity.remind_object;

    const currentUser = this.session.getLoggedInUser();
    const iconTime: number =
      currentUser && currentUser.guid === entity.ownerObj.guid
        ? currentUser.icontime
        : this.quotedEntity.ownerObj.icontime;

    this.avatarUrl =
      this.configs.get('cdn_url') +
      'icon/' +
      this.quotedEntity.ownerObj.guid +
      '/medium/' +
      iconTime;
  }

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @Input() parentService: ActivityService;

  avatarUrl: string;
  quotedEntity;

  isModal: boolean = false;
  isSingle: boolean = false;

  canonicalUrlSubscription: Subscription;

  canonicalUrl: string;

  constructor(
    public service: ActivityService,
    public session: Session,
    private configs: ConfigsService,
    private router: Router
  ) {}

  ngOnInit() {
    const opts = {
      ...this.parentService.displayOptions,
      permalinkBelowContent: false,
      showPostMenu: false,
      showOwnerBlocK: true,
      isQuote: true,
    };

    this.service.displayOptions = opts;

    this.isModal = this.service.displayOptions.isModal;
    this.isSingle = this.service.displayOptions.isSingle;

    this.canonicalUrlSubscription = this.service.canonicalUrl$.subscribe(
      canonicalUrl => {
        this.canonicalUrl = canonicalUrl;
      }
    );
  }

  ngOnDestroy(): void {
    this.canonicalUrlSubscription.unsubscribe();
  }

  /**
   * Navigate to single activity page of the quoted post,
   * but only if you haven't clicked another link inside the post
   * @param $event
   */
  onClickActivity($event) {
    // If link, only go to that link
    if ($event.target instanceof HTMLAnchorElement) {
      $event.stopPropagation();
    } else {
      // if no link, go to single page
      this.router.navigateByUrl(this.canonicalUrl);
    }
  }
}
