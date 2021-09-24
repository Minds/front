/**
 * @author Ben Hayward
 * @desc Wrapper for CKEditor5 text editor.
 */
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SiteService } from '../../../../../common/services/site.service';
import { ThemeService } from '../../../../../common/services/theme.service';
import { AttachmentService } from '../../../../../services/attachment';

declare var require: any;

@Component({
  selector: 'm-blog__editor',
  host: {
    class: 'm-blog',
  },
  templateUrl: 'editor.component.html',
  styleUrls: ['./editor.component.ng.scss', '../../../view/view.ng.scss'],
})
export class BlogEditorComponent implements OnInit, OnDestroy {
  /**
   * Content to place into the editor on load.
   */
  @Input() content: string;

  /**
   * Emitted when content changes.
   */
  @Output() contentChanged: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * Editor instance
   */
  Editor: any;
  editorConfig$: BehaviorSubject<any> = new BehaviorSubject(this.buildConfig());
  themeSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
    private attachment: AttachmentService,
    private site: SiteService,
    public themeService: ThemeService
  ) {}

  buildConfig(dark?: boolean) {
    return {
      uploadHandler: async file => {
        const response = this.attachment.upload(await file);
        return `${this.site.baseUrl}fs/v1/thumbnail/${await response}/xlarge`;
      },
      isDark$: this.themeService.isDark$,
      mediaEmbed: {
        // setting this to false because we want to
        // populate minds links every time so we can set
        // the embed theme according to site theme
        previewsInData: false,
        extraProviders: [
          {
            name: 'minds',
            url: [/^minds\.com\/newsfeed\/(\w+)/, /^minds\.com\/embed\/(\w+)/],
            html: match => {
              const guid = match[1];
              return `<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">
              <iframe src="http://localhost:4300/embed/${guid}?theme=${
                dark ? 'dark' : 'light'
              }"
                  style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
                  frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
              </iframe>
          </div>`;
            },
          },
        ],
      },
    };
  }

  ngOnInit() {
    // TODO: dynamically change the config so we can change
    // minds provider html output to output the embed theme
    // according to site theme
    this.themeSubscription = this.themeService.isDark$.subscribe(dark => {
      // FIXME: for some reason this doesn't work
      this.editorConfig$.next(this.buildConfig(dark));
    });
    // Render on browser side.
    if (isPlatformBrowser(this.platformId)) {
      // Must be required here for client-side loading.
      const MindsEditor = require('@bhayward93/ckeditor5-build-minds');
      this.Editor = MindsEditor;
    }
  }

  /**
   * Called on content change. Emits current content value.
   * @param Event - change event.
   */
  onContentChanged($event: Event): void {
    this.contentChanged.emit($event);
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
