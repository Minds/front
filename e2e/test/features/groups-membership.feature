Feature: Groups Membership
  As a user
  I should be able to manage my groups from a single page

  Scenario: Seeing no groups notice when I have no groups
    Given I create a new user
    And I am on the groups membership page
    Then I should see the no groups notice

  Scenario: Seeing group recommendations
    Given I am logged in
    And I am on the groups membership page
    Then I should see recommended groups

  Scenario: Clicking create group button
    Given I am logged in
    And I am on the groups membership page
    When I click the create group button
    Then I should see "/groups/create" in current URL

  Scenario: Clicking discover groups button
    Given I am logged in
    And I am on the groups membership page
    When I click the discover groups button
    Then I should see "/discovery/suggestions/group" in current URL
