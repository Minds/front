Feature: permaweb
  As a customer
  I want to be able to interact with permaweb page
  So users can successfully post with permaweb options

  Scenario: should post an activity with permaweb
    Given I am logged in
    When I am on the permaweb page
    Then I can post an activity with permaweb
