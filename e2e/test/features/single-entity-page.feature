Feature: Single Entity Page Feature
  As a user
  I should be able to see a single entity on its own page

  Scenario: Automatically opening the boost modal after navigating to a sep
    Given I am logged in
    When I navigate to a single entity page whose url contains a query param for opening the boost modal after a delay of 1000 ms
    Then I wait for the boost modal to appear after 1000 ms