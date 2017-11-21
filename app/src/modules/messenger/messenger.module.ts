import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ChannelModule } from '../channel/channel.module';
import { ModalsModule } from '../modals/modals.module';

import { Messenger } from './messenger.component';
import { MessengerChannelButton } from './channel-button/channel-button.component';
import { MessengerConversation } from './conversation/conversation.component';
import { MessengerEncryption } from './encryption/encryption.component';
import { MessengerScrollDirective } from './scroll';
import { MessengerConversationDockpanes } from './dockpanes/dockpanes.component';
import { MessengerUserlist } from './userlist/userlist.component';
import { MessengerSetupChat } from './setup/setup.component';

import { Client } from '../../common/api/client.service';
import { MessengerConversationDockpanesService } from './dockpanes/dockpanes.service';
import { MessengerEncryptionService } from './encryption/encryption.service';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    //LegacyModule,
    //ChannelModule,
    //ModalsModule
  ],
  declarations: [
    Messenger,
    MessengerChannelButton,
    MessengerConversation,
    MessengerEncryption,
    MessengerScrollDirective,
    MessengerConversationDockpanes,
    MessengerUserlist,
    MessengerSetupChat
  ],
  exports: [
    Messenger,
    MessengerChannelButton,
    MessengerConversation,
    MessengerEncryption,
    MessengerScrollDirective,
    MessengerConversationDockpanes,
    MessengerUserlist,
    MessengerSetupChat
  ],
  providers: [
    {
      provide: MessengerConversationDockpanesService,
      useFactory: MessengerConversationDockpanesService._
    },
    {
      provide: MessengerEncryptionService,
      useFactory: MessengerEncryptionService._,
      deps: [ Client ]
    }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MessengerModule {
}
