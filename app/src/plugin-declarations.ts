/**
 * TODO: Load these automagically from gulp
 */
import {Messenger} from './plugins/Messenger/messenger';
import {BlogCard} from './plugins/blog/card/card';
import {ArchiveTheatre} from './plugins/archive/view/views/theatre';
import {ArchiveGrid} from './plugins/archive/view/views/grid';
import {BlogView} from './plugins/blog/view/view';
import {MessengerChannelButton} from './plugins/Messenger/channel-button/channel-button';
import {ThumbnailSelector} from './plugins/archive/components/thumbnail-selector';
import {GroupsJoinButton} from './plugins/Groups/groups-join-button';
import {GroupsProfileMembersInvite} from './plugins/Groups/profile/members/invite/invite';
import {GroupsCard} from './plugins/Groups/card/card';
import {GroupsCardUserActionsButton} from './plugins/Groups/profile/card-user-actions-button';
import {GroupsSettingsButton} from './plugins/Groups/profile/groups-settings-button';
import {GroupsProfileMembers} from './plugins/Groups/profile/members/members';
import {GroupsProfileRequests} from './plugins/Groups/profile/requests/requests';
import {GroupsProfileFeed} from './plugins/Groups/profile/feed/feed';
import {MessengerConversation} from './plugins/Messenger/conversation/conversation';
import {MessengerEncryption} from './plugins/Messenger/encryption/encryption';
import {MessengerScrollDirective} from './plugins/Messenger/scroll';
import {MessengerConversationDockpanes} from './plugins/Messenger/conversation-dockpanes/conversation-dockpanes';
import {MessengerUserlist} from './plugins/Messenger/userlist/userlist';
import {MessengerSetupChat} from './plugins/Messenger/setup-chat/setup-chat';

export const MINDS_PLUGIN_DECLARATIONS: any[] = [
  // Plugin based Components
  Messenger,
  BlogCard,
  ArchiveTheatre,
  ArchiveGrid,
  BlogView,
  MessengerChannelButton,
  ThumbnailSelector,
  GroupsJoinButton,
  GroupsProfileMembersInvite,
  GroupsCard,
  GroupsCardUserActionsButton,
  GroupsProfileMembers,
  GroupsProfileFeed,
  GroupsProfileRequests,
  GroupsSettingsButton,
  MessengerConversation,
  MessengerEncryption,
  MessengerScrollDirective,
  MessengerConversationDockpanes,
  MessengerUserlist,
  MessengerSetupChat,
];
