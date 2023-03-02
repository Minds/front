Feature: SEP
  As a user
  I should be able to see a single entity on its own page

  Scenario: Automatically opening the boost modal after navigating to a sep
    Given I am logged in
    When I navigate to a single entity page whose url contains a query param for opening the boost modal after a delay
    Then I wait for the boost modal to appear