import { ThemeService } from './../../services/theme.service';
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgxPopperjsContentComponent } from 'ngx-popperjs';

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
  @ViewChild('popper') popper: NgxPopperjsContentComponent;

  constructor(public themeService: ThemeService) {}

  emojiSelect($event) {
    this.emojiSelectEmitter.emit($event.emoji);
    this.popper?.hide();
  }
}
