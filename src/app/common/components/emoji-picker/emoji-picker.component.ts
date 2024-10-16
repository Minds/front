import { ThemeService } from './../../services/theme.service';
import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ViewContainerRef,
  Input,
} from '@angular/core';
import { NgxPopperjsContentComponent } from 'ngx-popperjs';
import { Subscription } from 'rxjs';

/**
 * Emoji picker icon trigger and popup component
 * Used to insert emojis
 *
 * Uses emoji mart and popper plugins
 *
 * See it in the composer toolbar
 */
@Component({
  selector: 'm-emojiPicker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['emoji-picker.component.ng.scss'],
})
export class EmojiPickerComponent {
  /** Custom icon name. */
  @Input() iconName: string = 'emoji_emotions';

  @Input() popperPlacement: string = 'top';
  showSelector = false;

  @ViewChild('emojiPickerOutlet', { read: ViewContainerRef })
  emojiPickerOutlet: ViewContainerRef;

  /**
   * On Post event emitter
   */
  @Output('emojiSelect') emojiSelectEmitter: EventEmitter<any> =
    new EventEmitter();
  popperModifiers: Array<any> = [];
  @ViewChild('popper') popper: NgxPopperjsContentComponent;

  onSelectSubscription: Subscription;

  constructor(
    public themeService: ThemeService,
    private cd: ChangeDetectorRef
  ) {}

  emojiSelect($event) {
    this.emojiSelectEmitter.emit($event.emoji);
    this.popper?.hide();
  }

  onShowSelector() {
    this.showSelector = true;
    this.detectChanges();
  }

  onHideSelector() {
    this.showSelector = false;
    this.detectChanges();
  }

  /**
   * Asyncronously loads in the emoji mart module
   */
  async loadEmojiMartComponent() {
    // Import our module
    const { PickerComponent } = await import('@ctrl/ngx-emoji-mart');

    if (!this.emojiPickerOutlet) {
      console.error('Could not find emoji picker outlet');
    }

    // Clear previous component
    this.emojiPickerOutlet.clear();

    // Attach the component
    const componentRef =
      this.emojiPickerOutlet.createComponent(PickerComponent);

    componentRef.instance.autoFocus = true;
    componentRef.instance.isNative = true;
    componentRef.instance.title = 'Pick your emoji…';
    componentRef.instance.emoji = 'point_up';
    componentRef.instance.color = '#1b85d6';
    componentRef.instance.darkMode = this.themeService.isDark$.getValue();

    this.onSelectSubscription?.unsubscribe();

    this.onSelectSubscription = componentRef.instance.emojiSelect.subscribe(
      (event) => {
        this.emojiSelect(event);
      }
    );

    // Trigger change detection
    this.detectChanges();
  }

  /**
   * whether emoji mart is loaded by lazy loading.
   * @returns { boolean }
   */
  get isEmojiMartLoaded() {
    return Boolean(this.onSelectSubscription);
  }

  onMouseEnter() {
    if (!this.isEmojiMartLoaded) {
      this.loadEmojiMartComponent();
    }
  }

  ngOnDestroy() {
    this.onSelectSubscription?.unsubscribe();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
