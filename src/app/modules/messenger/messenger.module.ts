import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';

import { Messenger } from './messenger.component';
import { MessengerChannelButton } from './channel-button/channel-button.component';
import { MessengerConversation } from './conversation/conversation.component';
import { MessengerEncryption } from './encryption/encryption.component';
import { MessengerScrollDirective } from './scroll';
import { MessengerConversationDockpanes } from './dockpanes/dockpanes.component';
import { MessengerUserlist } from './userlist/userlist.component';
import { MessengerSetupChat } from './setup/setup.component';
import { MessengerOnboardingSetupComponent } from './onboarding/setup.component';
import { MessengerConversationBuilderService } from './dockpanes/conversation-builder.service';

import { Client } from '../../common/api/client.service';
import { MessengerEncryptionService } from './encryption/encryption.service';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
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
    MessengerSetupChat,
    MessengerOnboardingSetupComponent,
  ],
  exports: [
    Messenger,
    MessengerChannelButton,
    MessengerConversation,
    MessengerEncryption,
    MessengerScrollDirective,
    MessengerConversationDockpanes,
    MessengerUserlist,
    MessengerSetupChat,
    MessengerOnboardingSetupComponent,
  ],
  providers: [MessengerEncryptionService, MessengerConversationBuilderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MessengerModule {}
