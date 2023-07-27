Feature: report
  As a user
  I should be able to report entities

Background:
    Given I create a new user
    And I am on the newsfeed
    And I create a post with response storage key "reportable-post"

Scenario: Report a post with "animal abuse" sub-category
    Given I log in as "playwright_tests_user"
    And I navigate to the post with the response storage key "reportable-post"
    And I open the report modal
    And I select the report modal option with text "Illegal"
    And I click report modal next button
    And I select the report modal option with text "Animal abuse"
    When I click report modal the submit button
    Then I should see the report modal success panel
