import { Component, Injector, ViewChild } from '@angular/core';

import { SocketsService } from '../../../services/sockets';

import { Storage } from '../../../services/storage';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

import { MessengerConversationDockpanesService } from '../dockpanes/dockpanes.component';
import { MessengerEncryptionService } from '../encryption/encryption.service';
import { MessengerEncryption } from '../encryption/encryption.component';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  moduleId: module.id,
  selector: 'm-messenger--userlist',
  templateUrl: 'userlist.component.html',
})
export class MessengerUserlist {
  readonly cdnUrl: string;

  conversations: Array<any> = [];
  offset: string = '';

  setup: boolean = false;
  hasMoreData: boolean = true;
  inProgress: boolean = false;
  cb: number = Date.now();

  socketSubscriptions = {
    touchConversation: null,
  };

  userListToggle: boolean = false;
  ribbonOpened: boolean = false;

  search_timeout;

  constructor(
    public session: Session,
    public client: Client,
    public sockets: SocketsService,
    public encryption: MessengerEncryptionService,
    public dockpanes: MessengerConversationDockpanesService,
    public storage: Storage,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      if (this.userListToggle) this.load({ refresh: true });
      this.listen();
      this.autoRefresh();
    }
  }

  load(opts) {
    (<any>Object).assign(
      {
        limit: 12,
        offset: '',
        refresh: false,
      },
      opts
    );

    if (this.inProgress && !opts.refresh) return false;

    this.inProgress = true;

    if (opts.refresh) {
      this.offset = '';
      this.cb = Date.now();
    }

    this.client
      .get('api/v2/messenger/conversations', opts)
      .then((response: any) => {
        if (!response.conversations) {
          this.hasMoreData = false;
          this.inProgress = false;
          return false;
        }

        if (opts.refresh) {
          this.conversations = response.conversations;
        } else {
          this.conversations = this.conversations.concat(
            response.conversations
          );
        }

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch(error => {
        console.log('got error' + error);
        this.inProgress = false;
      });
  }

  search(q: string | HTMLInputElement) {
    if (this.search_timeout) clearTimeout(this.search_timeout);

    this.conversations = [];

    if (typeof (<HTMLInputElement>q).value !== 'undefined') {
      q = (<HTMLInputElement>q).value;
    }

    if (!q) {
      return this.load({ refresh: true });
    }

    this.search_timeout = setTimeout(() => {
      this.inProgress = true;
      this.client
        .get('api/v2/messenger/search', {
          q,
          limit: 24,
        })
        .then((response: any) => {
          if (!response.conversations) {
            this.hasMoreData = false;
            this.inProgress = false;
            return false;
          }

          this.conversations = response.conversations;

          this.offset = response['load-next'];
          this.inProgress = false;
        })
        .catch(error => {
          console.log('got error' + error);
          this.inProgress = false;
        });
    }, 300);
  }

  openConversation(conversation) {
    conversation.open = true;
    this.dockpanes.open(conversation);
  }

  listen() {
    this.socketSubscriptions.touchConversation = this.sockets.subscribe(
      'touchConversation',
      guid => {
        for (var i in this.dockpanes.conversations) {
          if (this.dockpanes.conversations[i].guid === guid) {
            this.dockpanes.conversations[i].unread = true;
            return;
          }
        }

        this.client
          .get(`api/v2/messenger/conversations/${guid}`)
          .then(response => {
            this.openConversation(response);
          });
      }
    );
  }

  unListen() {
    for (let sub in this.socketSubscriptions) {
      if (this.socketSubscriptions[sub]) {
        this.socketSubscriptions[sub].unsubscribe();
      }
    }
  }

  // Open the userlist with the ribbon
  ribbonToggle() {
    if (!this.ribbonOpened && !this.userListToggle) {
      this.userListToggle = true;
    }
    this.ribbonOpened = !this.ribbonOpened;
  }

  // Close the ribbon with the userlist
  toggle() {
    if (this.ribbonOpened) {
      this.ribbonOpened = false;
    }
    this.userListToggle = !this.userListToggle;
    if (this.userListToggle) this.load({ refresh: true });
  }

  autoRefresh() {
    setInterval(() => {
      if (!this.userListToggle) return;
      this.client
        .get('api/v2/messenger/conversations', { limit: 12 })
        .then((response: any) => {
          if (!response.conversations) {
            return false;
          }

          for (let j = 0; j < response.conversations.length; j++) {
            for (let i = 0; i < this.conversations.length; i++) {
              if (
                this.conversations[i].guid === response.conversations[j].guid
              ) {
                this.conversations[i] = response.conversations[j];
              }
            }
          }
        });
    }, 30000); // refresh 30 seconds
  }

  logout() {
    this.encryption.logout();
    this.dockpanes.closeAll();
  }

  openPane() {
    this.userListToggle = true;
  }

  ngOnDestroy() {
    this.unListen();
  }
}
export { MessengerConversation } from '../conversation/conversation.component';
