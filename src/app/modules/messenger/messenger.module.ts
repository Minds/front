import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
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

import { Client } from '../../common/api/client.service';
import { MessengerConversationDockpanesService } from './dockpanes/dockpanes.service';
import { MessengerEncryptionService } from './encryption/encryption.service';
import { Storage } from '../../services/storage';
import { Session } from '../../services/session';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    //LegacyModule,
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
  providers: [
    MessengerConversationDockpanesService,
    MessengerEncryptionService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MessengerModule {}
