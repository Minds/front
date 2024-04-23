Feature: Chat
  As a user
  I want to interact with other users through Chat

  Scenario: create a one on one chat room
    Given I am logged in
    When I click the chat icon in the sidebar
    And I click the Create New Chat button
    And I type "playwright_tests_user_2" in the chat room creator search input field
    And I select "playwright_tests_user_2" in the chat room creator
    And I press the chat room creator submit button 
    Then I should see a chat room with "playwright_tests_user_2" in the chat room list

  Scenario: send text messages to other users
    Given I am logged in
    When I click the chat icon in the sidebar
    And I open the first chat room
    And I type "Hello" in the chat input field
    And I press the chat message Send button
    Then I should see the last message in the chat room contains "Hello"

  Scenario: send rich embed messages to other users
    Given I am logged in
    When I click the chat icon in the sidebar
    And I open the first chat room
    And I type "testing https://www.minds.com/" in the chat input field
    And I press the chat message Send button
    Then I should see the last message in the chat room contains "testing https://www.minds.com/"
    And I should see the last message has a rich embed in the chat room for "https://www.minds.com/"

  Scenario: delete one on one chats
    Given I am logged in
    When I click the chat icon in the sidebar
    And I open the chat room with the name containing "playwright_tests_user_2"
    And I click the chat room settings button
    And I click the delete chat room button
    And I click to accept the confirmation modal
    And I should see an "success" toaster saying "Chat room deleted"
    Then I should not see the chat room with "playwright_tests_user_2" in the chat room list
    And I refresh the page
    And I should not see the chat room with "playwright_tests_user_2" in the chat room list

  Scenario: accept a chat invite request
    Given I log in as "supermind_sender"
    And I click the chat icon in the sidebar
    And I click the Create New Chat button
    And I type "playwright_tests_user_2" in the chat room creator search input field
    And I select "playwright_tests_user_2" in the chat room creator
    And I press the chat room creator submit button
    And I log in as "playwright_tests_user_2"
    And I click the chat icon in the sidebar
    When I click the to view my chat requests
    And I open the first chat request
    And I click the accept chat request button
    Then I should see a chat room with "supermind_sender" in the chat room list
    And I open the chat room with the name containing "supermind_sender"
    And I click the chat room settings button
    And I click the delete chat room button
    And I click to accept the confirmation modal
    And I should see an "success" toaster saying "Chat room deleted"