namespace ChatSteps {
  const {
    chatPage,
    chatRoomListComponent,
    chatRoomComponent,
    createNewChatModalComponent,
  } = inject();

  When('I click the chat icon in the sidebar', () => {
    chatPage.openViaSidebar();
  });

  When('I open the first chat room', () => {
    chatRoomListComponent.openChatRoomAtIndex(1);
  });

  When('I type {string} in the chat input field', (text: string) => {
    chatRoomComponent.typeMessage(text);
  });

  When('I press the chat message Send button', () => {
    chatRoomComponent.sendMessage();
  });

  When('I click the Create New Chat button', () => {
    chatPage.clickCreateNewChatButton();
  });

  When(
    'I type {string} in the chat room creator search input field',
    (username: string) => {
      createNewChatModalComponent.searchForUser(username);
    }
  );

  When('I select {string} in the chat room creator', (username: string) => {
    createNewChatModalComponent.selectUserByUsername(username);
  });

  When('I press the chat room creator submit button', () => {
    createNewChatModalComponent.clickStartChatButton();
  });

  When(
    'I open the chat room with the name containing {string}',
    (text: string) => {
      chatRoomListComponent.openRoomWithNameContaining(text);
    }
  );

  When('I click the chat room settings button', () => {
    chatRoomComponent.clickChatRoomSettingsButton();
  });

  When('I click the delete chat room button', () => {
    chatRoomComponent.clickDeleteChatButton();
  });

  When('I click the to view my chat requests', () => {
    chatRoomListComponent.clickPendingChatRequestsWidget();
  });

  When('I open the first chat request', () => {
    chatRoomListComponent.openChatRoomAtIndex(1);
  });

  When('I click the accept chat request button', () => {
    chatRoomComponent.clickAcceptChatRequestButton();
  });

  When('I click the reject chat request button', () => {
    chatRoomComponent.clickRejectChatRequestButton();
  });

  When('I navigate back to the chat room list', () => {
    chatRoomListComponent.clickChatRequestModeBackButton();
  });

  Then(
    'I should see the last message in the chat room contains {string}',
    (text: string) => {
      chatRoomComponent.hasLastMessageWithText(text);
    }
  );

  Then(
    'I should see a chat room with {string} in the chat room list',
    (roomText: string) => {
      chatRoomListComponent.hasRoomWithNameContaining(roomText);
    }
  );

  Then(
    'I should not see the chat room with {string} in the chat room list',
    (text: string) => {
      chatRoomListComponent.hasNoRoomWithNameContaining(text);
    }
  );

  Then(
    'I should see the last message has a rich embed in the chat room for {string}',
    (text: string) => {
      chatRoomComponent.waitForRichEmbed();
      chatRoomComponent.hasRichEmbedWithUrlInLastMessage(text);
    }
  );
}
