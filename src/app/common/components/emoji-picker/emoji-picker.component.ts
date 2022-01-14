import { ThemeService } from './../../services/theme.service';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-emojiPicker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
})
export class EmojiPickerComponent {
  popperPlacement: string = 'bottom';
  shown: boolean = false;

  /**
   * On Post event emitter
   */
  @Output('emojiSelect') emojiSelectEmitter: EventEmitter<
    any
  > = new EventEmitter();
  popperModifiers: Array<any> = [];

  constructor(public themeService: ThemeService) {}
}
