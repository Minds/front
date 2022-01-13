import { ThemeService } from './../../services/theme.service';
import { NgxPopperjsContentComponent } from 'ngx-popperjs';
import { Component, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-emojiPicker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
})
export class EmojiPickerComponent {
  /**
   * On Post event emitter
   */
  @Output('emojiSelect') emojiSelectEmitter: EventEmitter<
    any
  > = new EventEmitter();

  popperModifiers: Array<any> = [];

  @ViewChild('popper') popper: NgxPopperjsContentComponent;

  constructor(public themeService: ThemeService) {}
}
