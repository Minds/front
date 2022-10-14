Feature: channel
  As a customer
  I want to be able to interact with my channel

  Scenario: should update feed on post deletion from channel
    Given I am logged in
    And I am on my channel page
    And I create a post with text storage key "channel-activity-deletion"
    When I delete post on my "channel" stored with storage key "channel-activity-deletion"
    Then I should not see a post on my "channel" with text for storage key "channel-activity-deletion"
