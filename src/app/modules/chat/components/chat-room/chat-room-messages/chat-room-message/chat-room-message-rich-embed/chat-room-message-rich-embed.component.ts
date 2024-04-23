import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { CommonModule } from '../../../../../../../common/common.module';
import { WINDOW } from '../../../../../../../common/injection-tokens/common-injection-tokens';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

/**
 * Chat room message rich embed component.
 */
@Component({
  selector: 'm-chatRoomMessage__richEmbed',
  styleUrls: ['./chat-room-message-rich-embed.component.ng.scss'],
  templateUrl: './chat-room-message-rich-embed.component.html',
  host: { '(click)': 'handleRichEmbedClick($event)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule],
  standalone: true,
})
export class ChatRoomMessageRichEmbedComponent {
  /** Thumbnail src. */
  @Input() protected thumbnailSrc: string;

  /** Title of the rich embed. */
  @Input() protected title: string;

  /** Url of the rich embed to be displayed and navigated to. */
  @Input() protected url: string;

  constructor(
    public cd: ChangeDetectorRef,
    private toaster: ToasterService,
    @Inject(WINDOW) private window: Window
  ) {}

  /**
   * Handle rich embed click by opening the URL in a new tab.
   * @param { MouseEvent } $event - The click event.
   * @returns { void }
   */
  protected handleRichEmbedClick($event: MouseEvent): void {
    $event.stopPropagation();

    if (!this.url) {
      this.toaster.warn('You are not able to open this link.');
      return;
    }

    this.window.open(this.url, '_blank');
  }
}
