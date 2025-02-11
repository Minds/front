import { Component, ViewEncapsulation } from '@angular/core';
import { ChatRoomComponent } from '../sub-pages/chat-room/chat-room.component';
import { CreateChatRoomService } from '../../../services/create-chat-room.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { CommonModule } from '@angular/common';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Component({
  selector: 'm-chat__ai',
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.ng.scss',
  standalone: true,
  imports: [ChatRoomComponent, CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class AiChatComponent {
  public roomId: string;

  constructor(
    private createChatRoom: CreateChatRoomService,
    private toaster: ToasterService,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.loadRoom();
  }

  async loadRoom(): Promise<void> {
    try {
      const chatRoomId: string = await this.createChatRoom.createChatRoom([
        this.configs.get('ai').default_chat_user_guid,
      ]);

      if (!chatRoomId) {
        throw new Error('Chat room creation failed');
      }

      this.roomId = chatRoomId;
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
    }
  }
}
