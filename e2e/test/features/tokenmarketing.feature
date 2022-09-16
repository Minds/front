Feature: tokenmarketing
  As a customer
  I want to be able to interact with token marketing page
  So users can successfully see buy tokens button

  Scenario: should be able to trigger buy tokens button
    Given I am logged in
    When I am on the token marketing page
    Then I see buy tokens button
