Feature: newsfeed
  As a customer
  I want to be able to interact with my newsfeed

  Scenario: should update feed on post deletion from newsfeed
    Given I am logged in
    And I am on the newsfeed
    And I create a post with text storage key "newsfeed-activity-deletion"
    When I delete post on my "newsfeed" stored with storage key "newsfeed-activity-deletion"
    Then I should not see a post on my "newsfeed" with text for storage key "newsfeed-activity-deletion"
