Feature: Boost Display
  As a user
  I should see boosts at the appropriate time

  Scenario: I should see boost rotator when logged in with a user older than a week
    Given I am logged in
    And I am on the newsfeed
    Then I should see the boost rotator

  Scenario: I should NOT see boost rotator when logged in with a new user
    Given I create a new user
    And I am on the newsfeed
    Then I should not see the boost rotator
    And I clear my cookies
