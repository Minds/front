Feature: boost
  As a customer
  I want to be able to interact with boost page
  So users can successfully create a valid newsfeed boost

  Scenario: should allow the user to make a valid newsfeed boost
    Given I am logged in
    When I create a post on newsfeed
    Then I can create a valid newsfeed boost
    And I can revoke a boost
