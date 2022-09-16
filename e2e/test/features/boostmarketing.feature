Feature: boostmarketing
  As a customer
  I want to be able to interact with boost marketing page
  So users can successfully see create boost button

  Scenario: should be able to trigger create boost button
    Given I am logged in
    When I am on the boost marketing page
    Then I see create boost button
