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

  @HostBinding('class.m-activity__quote--supermindReply')
  isSupermindReply: boolean;

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
  isInset: boolean = false;

  canonicalUrlSubscription: Subscription;

  canonicalUrl: string;

  // Capture pointerdown time so we can determine if longpress
  pointerdownMs: number;

  subscriptions: Subscription[];

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
    this.isInset = this.service.displayOptions.isInset;

    this.subscriptions = [
      this.service.canonicalUrl$.subscribe(canonicalUrl => {
        this.canonicalUrl = canonicalUrl;
      }),
    ];

    this.subscriptions.push(
      this.service.isSupermindReply$.subscribe(is => {
        this.isSupermindReply = is;
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // Capture pointerdown time so we can determine if longpress
  onActivityPointerdown($event) {
    this.pointerdownMs = Date.now();
  }

  /**
   * Navigate to single activity page,
   * but only if you haven't clicked another link
   * or cta (buttons, dropdown items) inside the post
   * @param $event
   *
   */
  onActivityPointerup($event): void {
    const target = $event.target;

    // Only check for longpress if a pointerdown event occured
    let longPress = false;
    if (this.pointerdownMs && Date.now() - this.pointerdownMs > 1000) {
      longPress = true;
    }
    const ignoredContext = this.isInset;

    if (longPress || ignoredContext) {
      return;
    }

    const clickedAnchor = !!target.closest('a');
    const clickedStopClick = this.descendsFromClass(
      target,
      'm-activity__redirect--stopClick'
    );

    const clickedIgnoreClick = this.descendsFromClass(
      target,
      'm-activity__redirect--ignoreClick'
    );

    if (clickedAnchor || clickedStopClick) {
      // If link or menu trigger, don't redirect
      $event.stopPropagation();
      return;
    } else if (clickedIgnoreClick) {
      // if clicked on something with its own click function,
      // ignore the redirect click here
      // but allow propagation within the item
      return;
    }

    // If middle click, open in new tab instead
    if ($event.button == 1) {
      window.open(this.canonicalUrl, '_blank');
    } else {
      // Everything else go to single page
      this.router.navigateByUrl(this.canonicalUrl);
    }
  }

  /**
   * @param node that you clicked
   * @param className you are checking for
   * @returns true if the node has the class or descends from a parent with the class
   */
  descendsFromClass(node, className): boolean {
    if (node.classList.contains(className)) {
      return true;
    }

    // Cycle through parents until we find a match
    while ((node = node.parentElement) && !node.classList.contains(className));
    return !!node;
  }
}
