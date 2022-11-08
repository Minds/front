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

  Scenario: I should be able to toggle remind from the boost rotator
    Given I am logged in
    And I am on the newsfeed
    And I remind the boost featured in the boost rotator
    Then I should see an "success" toaster saying "remind"

  Scenario: I should be able to quote from the boost rotator
    Given I am logged in
    And I am on the newsfeed
    And I click to quote the boost featured in the boost rotator
    When I enter "test quote" in the composer text area
    And I click the post button
    Then I am able to create the post
