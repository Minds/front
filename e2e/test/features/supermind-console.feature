Feature: Supermind Console
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
