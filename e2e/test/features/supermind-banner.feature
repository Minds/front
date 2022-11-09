Feature: Supermind Banner
  As a user
  I want my posts to get engagement from other target users

  Scenario: supermind banner appears after starting to type comment
    Given I am logged in
    And I am on the 'minds' channel page
    When I navigate to the single entity page of the post in position '1' of the 'channel' feed
    And I enter 'foo' in the comment poster input
    Then I wait for the upgrade comment supermind banner to appear
