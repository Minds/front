import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ComposerService, ComposerSize } from './services/composer.service';
import { ComposerModalService } from './components/modal/modal.service';
import { BaseComponent } from './components/base/base.component';
import { ToasterService } from '../../common/services/toaster.service';
import { Subscription } from 'rxjs';
import { Session } from '../../services/session';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CookieService } from '../../common/services/cookie.service';

/**
 * Wrapper component for composer. It can hold an embedded base composer
 * or a placeholder-like non-interactive copy that will open a floating modal
 */
@Component({
  providers: [ComposerService],
  selector: 'm-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'composer.component.html',
})
export class ComposerComponent implements OnInit, OnDestroy {
  /**
   * Is this an embedded composer (i.e. no modal)
   */
  @Input() embedded: boolean = false;

  /**
   * Set composer size.
   */
  @Input() set size(size: ComposerSize) {
    this.service.size$.next(size);
  }

  /**
   * Input activity (for edits)
   * @param activity
   * @private
   */
  @Input('activity') set _activity(activity: any) {
    if (activity) {
      this.service.load(activity);
    }
  }

  /**
   * Container GUID (group context)
   * @param containerGuid
   * @private
   */
  @Input('containerGuid') set _containerGuid(containerGuid: any) {
    if (typeof containerGuid !== 'undefined') {
      this.service.setContainerGuid(containerGuid);
    }
  }

  /**
   * Post event emitter
   * Consider whether feedsUpdateService
   * better suits your needs before hooking in.
   */
  @Output('onPost') onPostEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Posting error event emitter
   */
  @Output('onPostError') onPostErrorEmitter: EventEmitter<
    any
  > = new EventEmitter<any>();

  /**
   * Is the modal open?
   */
  modalOpen: boolean = false;

  /**
   * Embedded composer ref
   */
  @ViewChild('embeddedBaseComposer')
  protected embeddedBaseComposer: BaseComponent;

  /**
   * Popup placeholder composer ref
   */
  @ViewChild('popOutBaseComposer')
  protected popOutBaseComposer: BaseComponent;

  /**
   * Was this component destroyed (yes, it can happen)
   */
  protected destroyed: boolean = false;

  protected tooManyTagsSubscription: Subscription;

  querySubscription: Subscription;

  /**
   * Constructor
   * @param composerModalService
   * @param toaster
   * @param service
   * @param cd
   * @param injector
   */
  constructor(
    protected composerModalService: ComposerModalService,
    protected toaster: ToasterService,
    protected service: ComposerService /* NOTE: Used for DI. DO NOT REMOVE OR CHANGE !!! */,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    protected session: Session,
    protected route: ActivatedRoute,
    public cookieService: CookieService,
    public router: Router
  ) {
    this.tooManyTagsSubscription = this.service.tooManyTags$.subscribe(
      value => {
        if (value) {
          const message = 'You may include up to 5 hashtags';

          if (!this.toaster.isToastActive(message)) {
            this.toaster.error(message);
          }
        }
      }
    );
  }

  ngOnInit(): void {
    if (this.cookieService.get('intent-url')) {
      this.onTriggerClick();
      this.service.message$.next(this.cookieService.get('intent-url'));
    }

    this.querySubscription = this.route.queryParamMap.subscribe(
      (params: ParamMap) => {
        if (params.has('intentUrl')) {
          const intentUrl = params.get('intentUrl');
          if (this.session.isLoggedIn()) {
            this.onTriggerClick();
            this.service.message$.next(intentUrl);
          } else {
            this.cookieService.put('intent-url', intentUrl);
          }
        }
      }
    );
  }
  /**
   * Component destroy hook
   */
  ngOnDestroy(): void {
    this.destroyed = true;
    this.tooManyTagsSubscription.unsubscribe();
    this.composerModalService.dismiss();
    this.querySubscription.unsubscribe();
  }

  /**
   * Opens the modal when the placeholder is clicked
   * @param $event
   */
  async onTriggerClick($event?: MouseEvent) {
    this.modalOpen = true;
    this.detectChanges();

    //

    try {
      const event = await this.composerModalService
        .setInjector(this.injector)
        .present();

      if (this.destroyed) {
        // If the component was destroyed (i.e navigated away), do nothing
        return;
      }

      if (event) {
        this.onPostEmitter.emit(event);
      }
    } catch (e) {
      console.error('Composer.onTriggerClick', e);
      this.onPostErrorEmitter.emit(e);
    }

    this.modalOpen = false;

    // Intent url cleanup
    if (this.route.snapshot.queryParamMap.get('intentUrl')) {
      this.router.navigate(['.'], {
        queryParams: {},
        relativeTo: this.route,
      });
    }

    if (this.cookieService.get('intent-url')) {
      this.cookieService.remove('intent-url');
    }

    this.detectChanges();
  }

  /**
   * Can navigate away? Children base components are responsible for asking
   */
  canDeactivate(): boolean | Promise<boolean> {
    if (this.popOutBaseComposer) {
      return this.popOutBaseComposer.canDeactivate();
    }

    if (this.embeddedBaseComposer) {
      return this.embeddedBaseComposer.canDeactivate();
    }

    return true;
  }

  /**
   * Detect changes. Do nothing if component is destroyed.
   */
  detectChanges() {
    if (this.destroyed) {
      return;
    }

    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
