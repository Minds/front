Feature: Activity Feature
  As a user
  I should be able to interact with various activity types

  Scenario: Navigating to single entity page from the newsfeed
    Given I am logged in
    And I am on the newsfeed
    When I create a post with text storage key "navigate_to_sep"
    And I click the timestamp for the activity with the storage key "navigate_to_sep" on "newsfeed"
    Then I should see the back button on the single entity page
