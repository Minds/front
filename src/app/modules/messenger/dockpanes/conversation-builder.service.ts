/**
 * @desc Service used to build conversations
 */
import { Session } from '../../../services/session';
import { MindsUser } from '../../../interfaces/entities';
import { Injectable } from '@angular/core';

@Injectable()
export class MessengerConversationBuilderService {
  constructor(public session: Session) {}

  public buildConversation(user: MindsUser): {
    guid: string;
    participants: MindsUser[];
    open: boolean;
  } {
    return {
      guid: this.permutate(user),
      participants: [user],
      open: true,
    };
  }

  private permutate(user: MindsUser): string {
    let participants = [user.guid, this.session.getLoggedInUser().guid];
    participants.sort((a, b) => (a < b ? -1 : 1));
    return participants.join(':');
  }
}
