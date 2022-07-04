/**
 * @author Ben Hayward
 * @desc Wrapper for CKEditor5 text editor.
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AttachmentService } from '../../../../../services/attachment';
import { SiteService } from '../../../../../common/services/site.service';
import { ThemeService } from '../../../../../common/services/theme.service';

declare var require: any;

/**
 * Editor for blog content (i.e. not banner or title).
 * Uses ckeditor plugin
 */
@Component({
  selector: 'm-blog__editor',
  host: {
    class: 'm-blog',
  },
  templateUrl: 'editor.component.html',
  styleUrls: ['./editor.component.ng.scss', '../../../view/view.ng.scss'],
})
export class BlogEditorComponent {
  /**
   * Content to place into the editor on load.
   */
  @Input() content: string;

  /**
   * Emitted when content changes.
   */
  @Output() contentChanged: EventEmitter<Event> = new EventEmitter<Event>();

  Editor: any;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
    private attachment: AttachmentService,
    private site: SiteService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.emitThemePreference();
    // Render on browser side.
    if (isPlatformBrowser(this.platformId)) {
      // Must be required here for client-side loading.
      const MindsEditor = require('@bhayward93/ckeditor5-build-minds');
      this.Editor = MindsEditor;
      this.Editor.config = {
        uploadHandler: async file => {
          const response = this.attachment.upload(await file);
          return `${this.site.baseUrl}fs/v1/thumbnail/${await response}/xlarge`;
        },
        isDark$: this.themeService.isDark$,
      };
    }
  }

  /**
   * Called on content change. Emits current content value.
   * @param Event - change event.
   */
  onContentChanged($event: Event): void {
    this.contentChanged.emit($event);
  }
}
