import { MINDS_PROVIDERS } from './services/providers';

import { Client, Upload } from './services/api';

import { MessengerConversationDockpanesService } from './plugins/Messenger/conversation-dockpanes/service';
import { MessengerEncryptionService } from './plugins/Messenger/encryption/service';
import { GroupsService } from './plugins/Groups/groups-service';

export const MINDS_PLUGIN_PROVIDERS: any[] = [
  {
    provide: MessengerConversationDockpanesService,
    useFactory: MessengerConversationDockpanesService._
  },
  {
    provide: MessengerEncryptionService,
    useFactory: MessengerEncryptionService._,
    deps: [ Client ]
  },
  {
    provide: GroupsService,
    useFactory: GroupsService._,
    deps: [ Client, Upload ]
  }
];
