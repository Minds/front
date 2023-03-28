import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  SkipSelf,
} from '@angular/core';
import { ActivityService } from '../../../modules/newsfeed/activity/activity.service';
import { ClientMetaDirective } from '../../directives/client-meta.directive';
import {
  ClientMetaData,
  ClientMetaService,
} from '../../services/client-meta.service';

@Component({
  selector: 'm-readMore',
  templateUrl: './read-more.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./read-more.component.ng.scss'],
})
export class ReadMoreComponent {
  /**
   * The raw input text
   */
  @Input() text: string = '';

  /**
   * The length at which the truncation should kick in.
   * NOTE: we add a buffer to this to avoid outputs that are too close
   * to the threshold having minimal or wasted impact
   */
  @Input() targetLength: number = 280;

  /**
   * Replaces the "See more" label with "Continue reading"
   * and makes the text primary color
   */
  @Input()
  paywallContext: boolean = false;

  /**
   * The absolute max that should be truncated. This is to avoid long words bypassing our limit
   */
  protected readonly absoluteMax: number = 1000;

  /**
   * Controls if the read more should be toggled off. False shows ellipses
   */
  showAll = false;

  /**
   * whether the read-more can be expaned
   */
  @Input() disabled = false;

  @Output() onToggle = new EventEmitter();

  constructor(
    private cd: ChangeDetectorRef,
    private clientMetaService: ClientMetaService,
    private activityService: ActivityService,
    @SkipSelf() private parentClientMeta: ClientMetaDirective
  ) {}

  /**
   * Fires on output text click. We do this because we need to listen to link clicks
   * on anchor tags injected into the body via innerHTML, which strips any listeners
   * off the anchor tag at the time of injection. Instead we listen to all clicks on
   * any part of the output event, and filter out events on anchor tags to derive
   * when an anchor tag has been clicked.
   * @param { MouseEvent } $event - mouse event.
   * @returns { Promise<void> }
   */
  public async onOutputTextClick($event: MouseEvent): Promise<void> {
    if (($event.target as HTMLElement).tagName === 'A') {
      const activity: any = await this.activityService.entity$.getValue();

      let opts: Partial<ClientMetaData> = {};
      if (Boolean(activity.boosted_guid)) {
        opts.campaign = activity.urn;
      }

      this.clientMetaService.recordClick(
        activity.guid,
        this.parentClientMeta,
        opts
      );
    }
  }

  /**
   * The transformed text that the html template will render
   */
  get outputText(): string {
    if (this.showAll || !this.shouldTruncate) {
      return this.text;
    }
    return (
      this.text.substring(
        0,
        Math.min(
          this.text.lastIndexOf(' ', this.targetLength),
          this.absoluteMax
        )
      ) + '...'
    );
  }

  /**
   * Logic for if any truncation should happen
   * 'Show more' button will also not show if this is false
   */
  get shouldTruncate(): boolean {
    // In paywall context, cutoff text regardless,
    if (this.paywallContext) {
      return this.text.length > this.targetLength;
    }

    return this.text.length >= this.targetLength * 2;
  }
  /**
   * The 'See more' and 'See less' cta will call this
   * It will control the outputText
   */
  toggle(): void {
    this.onToggle.emit(!this.showAll);

    if (this.disabled) return;

    this.showAll = !this.showAll;

    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
