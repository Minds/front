Feature: Supermind
  As a user I want to be able to access the Supermind Console

  Scenario: Switching tabs from inbox to outbox
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change tabs to "Outbound"
    Then I should see "/supermind/outbox" in current URL
    And I should see my Supermind Console "outbox"
  
  Scenario: Checking outbox and then inbox
    Given I am logged in
    And I am on the Supermind Console "outbox" page
    When I click to change tabs to "Inbound"
    Then I should see "/supermind/inbox" in current URL
    And I should see my Supermind Console "inbox"

  Scenario: Clicking add bank prompt
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click the prompt to add my bank information
    Then I should see "/wallet/cash/settings" in current URL

  Scenario: A supermind is created and declined
    Given I am logged in as "supermind_sender"
    And I have clicked on the sidebar composer button
    When I make a supermind offer
    And I switch users to "playwright_tests_user"
    And I navigate via sidebar to the supermind console
    And I click "decline" on latest Supermind
    Then the supermind offer should be "declined"

  Scenario: A supermind is created and accepted
    Given I am logged in as "supermind_sender"
    And I have clicked on the sidebar composer button
    When I make a supermind offer
    And I switch users to "playwright_tests_user"
    And I navigate via sidebar to the supermind console
    And I click "accept" on latest Supermind
    And I make a supermind reply
    Then the supermind offer should be "accepted"

  Scenario: An attempt is made to create an NSFW supermind offer
    Given I am logged in as "supermind_sender"
    And I have clicked on the sidebar composer button
    When I try to make an NSFW supermind offer
    Then I see a "error" toaster containing "You may not create an NSFW supermind at this time"

  Scenario: An attempt is made to create an NSFW supermind reply
    Given I am logged in as "supermind_sender"
    And I have clicked on the sidebar composer button
    When I make a supermind offer
    And I switch users to "playwright_tests_user"
    And I navigate via sidebar to the supermind console
    And I click "accept" on latest Supermind
    And I try to make an NSFW supermind reply
    Then I see a "error" toaster containing "You may not create an NSFW supermind at this time"
