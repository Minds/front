import { NgForOf, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '../../../../common/common.module';
import { MarkdownModule } from 'ngx-markdown';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ApiService } from '../../../../common/api/api.service';
import { lastValueFrom } from 'rxjs';

type Message = {
  role: 'ASSISTANT' | 'USER' | 'SYSTEM';
  content: string;
};

@Component({
  selector: 'm-group__askAi',
  templateUrl: './ask-ai.component.html',
  styleUrl: './ask-ai.component.ng.scss',
  standalone: true,
  imports: [NgIf, NgForOf, CommonModule, MarkdownModule],
})
export class GroupAskAiComponent {
  /** The log of messages */
  messages: Message[] = [];

  /** Reference to he chat input */
  @ViewChild('chatInput') protected chatInput: ElementRef<HTMLTextAreaElement>;

  /** Status of if we are waiting for the AI assistant to respond */
  isAwaitingResponse = false;

  constructor(
    private toasterService: ToasterService,
    private apiService: ApiService
  ) {}

  protected onEnterPress($event: KeyboardEvent): void {
    if (!$event?.shiftKey) {
      $event.preventDefault();
      this.onSubmit();
    }
  }

  async onSubmit() {
    if (this.isAwaitingResponse) return;

    const message = this.chatInput.nativeElement.value;
    this.chatInput.nativeElement.value = '';

    // Add our message
    this.messages.push({
      role: 'USER',
      content: message,
    });
    this.scrollToBottom();

    // Show the loading dots
    this.isAwaitingResponse = true;

    // Submit the message to the api
    try {
      const response: any = await lastValueFrom(
        this.apiService.post('api/v3/seco/ai/chat', {
          messages: this.messages,
        })
      );

      // Add the message to the list
      this.messages.push({
        role: 'ASSISTANT',
        content: response.message.content,
      });
      this.scrollToBottom();
    } catch (err) {
      this.toasterService.error('Sorry, there was an error. Please try again.');
    } finally {
      // Remove the loading dots
      this.isAwaitingResponse = false;
    }
  }

  /**
   * Scrolls to the bottom of the page
   * TODO: Make this actually scroll to the correct message
   */
  private scrollToBottom() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 300);
  }
}
