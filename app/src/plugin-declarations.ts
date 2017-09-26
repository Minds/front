/**
 * TODO: Load these automagically from gulp
 */
import {Messenger} from './plugins/Messenger/messenger';
import {MessengerChannelButton} from './plugins/Messenger/channel-button/channel-button';
import {MessengerConversation} from './plugins/Messenger/conversation/conversation';
import {MessengerEncryption} from './plugins/Messenger/encryption/encryption';
import {MessengerScrollDirective} from './plugins/Messenger/scroll';
import {MessengerConversationDockpanes} from './plugins/Messenger/conversation-dockpanes/conversation-dockpanes';
import {MessengerUserlist} from './plugins/Messenger/userlist/userlist';
import {MessengerSetupChat} from './plugins/Messenger/setup-chat/setup-chat';

export const MINDS_PLUGIN_DECLARATIONS: any[] = [
  // Plugin based Components
  Messenger,
  MessengerChannelButton,
  MessengerConversation,
  MessengerEncryption,
  MessengerScrollDirective,
  MessengerConversationDockpanes,
  MessengerUserlist,
  MessengerSetupChat,
];
