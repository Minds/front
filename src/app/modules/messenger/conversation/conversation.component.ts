import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { SocketsService } from '../../../services/sockets';

import { MessengerEncryptionService } from '../encryption/encryption.service';

import { MessengerConversationDockpanesService } from '../dockpanes/dockpanes.service';
import { BlockListService } from '../../../common/services/block-list.service';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * DEPRECATED
 * Messenger was replaced with Minds Chat
 */
@Component({
  selector: 'm-messenger--conversation',
  host: {
    '(window:focus)': 'onFocus($event)',
    '(window:blur)': 'onBlur($event)',
  },
  inputs: ['conversation'],
  templateUrl: 'conversation.component.html',
})
export class MessengerConversation implements OnInit, OnDestroy {
  readonly cdnUrl: string;

  tabId: string;

  guid: string;
  conversation;
  participants: Array<any> = [];
  messages: Array<any> = [];
  offset: string = '';
  open: boolean = false;
  inProgress: boolean = false;
  live: boolean = true;

  scrollEmitter: EventEmitter<any> = new EventEmitter();

  message: string = '';
  showMessages: boolean = true; //TODO: find a better way to work out if encryption has been set
  blockingActionInProgress: boolean = false;

  chatNotice: string = '';

  socketSubscriptions = {
    pushConversationMessage: null,
    clearConversation: null,
    connect: null,
    disconnect: null,
    block: null,
    unblock: null,
  };

  focused: boolean = true;

  blocked: boolean = false;
  unavailable: boolean = false;
  invalid: boolean = false;

  invitable: any[] | null = null;
  invited: boolean = false;

  ribbonOpened: boolean = false;

  constructor(
    public session: Session,
    public client: Client,
    public sockets: SocketsService,
    public cd: ChangeDetectorRef,
    private renderer: Renderer2,
    public encryption: MessengerEncryptionService,
    public dockpanes: MessengerConversationDockpanesService,
    protected blockListService: BlockListService,
    configs: ConfigsService
  ) {
    this.buildTabId();
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    if (this.conversation.messages) {
      this.messages = this.conversation.messages;
    } else if (this.encryption.isOn() && this.conversation.open) {
      this.initialLoad();
    } else if (!this.encryption.isOn()) {
      this.showMessages = false;
    }
    this.listen();
  }

  ngOnDestroy() {
    this.unListen();
  }

  initialLoad() {
    this.load({ limit: 8 });
  }

  load(opts: any = {}) {
    opts = (<any>Object).assign(
      {
        limit: 12,
      },
      opts
    );

    const scrollView = opts.container;
    delete opts.container;

    if (!opts.finish) this.inProgress = true;

    this.client
      .get('api/v2/messenger/conversations/' + this.conversation.guid, opts)
      .then((response: any) => {
        this.inProgress = false;
        if (!response.messages) {
          return false;
        }

        if (opts.finish) {
          this.messages = this.messages.concat(response.messages);
          this.scrollEmitter.next(true);
        } else if (opts.offset) {
          const scrollTop = scrollView.scrollTop;
          const scrollHeight = scrollView.scrollHeight;
          if (this.messages.length) {
            response.messages.pop();
          }
          this.messages = response.messages.concat(this.messages);
          this.offset = response['load-previous'];

          this.cd.detectChanges();
          scrollView.scrollTop =
            scrollTop + scrollView.scrollHeight - scrollHeight;
        } else {
          this.messages = response.messages;
          this.offset = response['load-previous'];
          this.scrollEmitter.next(true);
        }

        if (this.conversation.open) {
          this.conversation.unread = false;
        }

        this.blocked = !!response.blocked;
        this.unavailable = !!response.unavailable;
        this.invitable = response.invitable || null;
      })
      .catch(() => {
        this.inProgress = false;
      });
  }

  listen() {
    if (this.conversation.socketRoomName) {
      this.sockets.join(this.conversation.socketRoomName);

      this.socketSubscriptions.pushConversationMessage = this.sockets.subscribe(
        'pushConversationMessage',
        (guid, message) => {
          if (guid !== this.conversation.guid) return;

          let fromSelf = false;

          if (this.session.getLoggedInUser().guid === message.ownerObj.guid) {
            if (this.tabId === message.tabId) {
              return;
            }

            fromSelf = true;
          }

          this.load({ limit: 1, finish: message.guid });

          if (!fromSelf) {
            this.invalid = false;

            if (!this.focused && document.title.indexOf('\u2022') === -1)
              document.title = '\u2022 ' + document.title;

            // this.sounds.play('new');
          }
        }
      );

      this.socketSubscriptions.clearConversation = this.sockets.subscribe(
        'clearConversation',
        (guid, actor) => {
          if (guid !== this.conversation.guid) return;

          this.messages = [];
          this.chatNotice = `${actor.name} cleared chat history`;
          this.invalid = false;
        }
      );

      this.socketSubscriptions.block = this.sockets.subscribe(
        'block',
        (guid) => {
          if (!this.hasParticipant(guid)) return;

          this.blocked = true;
        }
      );

      this.socketSubscriptions.unblock = this.sockets.subscribe(
        'unblock',
        (guid) => {
          if (!this.hasParticipant(guid)) return;

          this.blocked = false;
        }
      );

      this.socketSubscriptions.connect = this.sockets.subscribe(
        'connect',
        () => {
          this.live = true;
        }
      );

      this.socketSubscriptions.disconnect = this.sockets.subscribe(
        'disconnect',
        () => {
          this.live = false;
        }
      );
    }
  }

  unListen() {
    if (this.conversation.socketRoomName) {
      this.sockets.leave(this.conversation.socketRoomName);
    }

    for (const sub in this.socketSubscriptions) {
      if (this.socketSubscriptions[sub]) {
        this.socketSubscriptions[sub].unsubscribe();
      }
    }
  }

  send(e) {
    e.preventDefault();

    if (
      this.blocked ||
      !this.message ||
      this.message.split(/\r\n|\r|\n/).length >= 10
    ) {
      //not more than 10 return characters.
      return;
    }

    const newLength = this.messages.push({
        // Optimistic
        optimisticGuess: true,
        owner: this.session.getLoggedInUser(),
        message: this.message,
        time_created: Math.floor(Date.now() / 1000),
      }),
      currentIndex = newLength - 1;

    this.client
      .post('api/v2/messenger/conversations/' + this.conversation.guid, {
        message: this.message,
        encrypt: true,
        tabId: this.tabId,
      })
      .then((response: any) => {
        if (response.message) {
          this.messages[currentIndex] = response.message;
        } else if (response.unavailable) {
          this.unavailable = true;
        } else if (response.invalid) {
          this.invalid = true;
        }

        setTimeout(() => this.scrollEmitter.next(true), 50);
      })
      .catch((e) => {
        console.error('Error while reading conversation', e);
      });

    this.message = '';
    this.scrollEmitter.next(true);
  }

  deleteHistory() {
    if (
      !confirm(
        'All messages will be deleted for all parties. You cannot UNDO this action. Are you sure?'
      )
    ) {
      // TODO: Maybe a non-process-blocking popup?
      return;
    }

    this.messages = []; // Optimistic
    this.blockingActionInProgress = true;

    this.client
      .delete('api/v2/messenger/conversations/' + this.conversation.guid, {})
      .then((response: any) => {
        this.blockingActionInProgress = false;
      })
      .catch((e) => {
        console.error('Error when deleting history', e);
        this.blockingActionInProgress = false;
      });
  }

  block() {
    if (!this.conversation || !this.conversation.participants) {
      return;
    }

    if (!this.blocked) {
      if (
        !confirm('This action will block all parties site-wide. Are you sure?')
      ) {
        // TODO: Maybe a non-process-blocking popup?
        return;
      }
    }

    this.blockingActionInProgress = true;

    const blocks = [],
      newState = !this.blocked;

    this.conversation.participants.forEach((participant: any) => {
      if (this.blocked) {
        blocks.push(this.client.delete(`api/v1/block/${participant.guid}`, {}));
        this.blockListService.remove(`${participant.guid}`);
      } else {
        blocks.push(this.client.put(`api/v1/block/${participant.guid}`, {}));
        this.blockListService.add(`${participant.guid}`);
      }
    });

    Promise.all(blocks)
      .then((response: any) => {
        this.blockingActionInProgress = false;
        this.blocked = newState;
      })
      .catch((e) => {
        console.error('Error when toggling block on participants', e);
        this.blockingActionInProgress = false;
      });
  }

  invite() {
    if (!this.invitable || !this.invitable.length) {
      return;
    }

    this.invited = true;
    this.invitable.forEach((participant) => {
      this.client.put(
        `api/v2/messenger/conversations/invite/${participant.guid}`
      );
    });
  }

  onFocus(e) {
    this.focused = true;
    if (document.title.indexOf('\u2022') === 0) {
      document.title = document.title.substr(1);
    }
  }

  onBlur(e) {
    this.focused = false;
  }

  buildTabId() {
    this.tabId = (Math.random() + 1).toString(36).substring(7);
  }

  private hasParticipant(guid: string) {
    if (!this.conversation || !this.conversation.participants) {
      return false;
    }

    let has = false;

    this.conversation.participants.forEach((participant: any) => {
      if (participant.guid === guid) {
        has = true;
      }
    });
    return has;
  }

  // Open the conversation with the ribbon
  ribbonToggle() {
    if (!this.ribbonOpened && !this.conversation.open) {
      this.dockpanes.open(this.conversation);
    }
    this.ribbonOpened = !this.ribbonOpened;
  }

  // Close the ribbon with the conversation
  toggle() {
    if (this.ribbonOpened) {
      this.ribbonOpened = false;
    }
    this.dockpanes.toggle(this.conversation);
  }
}
