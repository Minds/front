import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import {
  ButtonColor,
  ButtonSize,
} from '../../components/button/button.component';
import { CommonModule } from '../../common.module';

@Component({
  selector: 'm-copyToClipboardButton',
  imports: [CommonModule, NgCommonModule],
  templateUrl: './copy-to-clipboard-button.component.html',
  styleUrls: ['./copy-to-clipboard-button.component.ng.scss'],
  standalone: true,
})
export class CopyToClipboardButtonComponent {
  @Input() contentToCopy: string = '';
  @Input() buttonText: string = 'Copy';
  @Input() successMessage: string = 'Copied to clipboard';

  @Input() solid: boolean = false;
  @Input() color: ButtonColor = 'grey';
  @Input() size: ButtonSize = 'medium';
  @Input() showIcon: boolean = true;

  @Output() onCopiedToClipboard: EventEmitter<void> = new EventEmitter<void>();

  constructor(private toaster: ToasterService) {}

  copyToClipboard() {
    const textArea = document.createElement('textarea');
    textArea.value = this.contentToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    this.onCopiedToClipboard.emit();
    this.toaster.success(this.successMessage);
  }
}
