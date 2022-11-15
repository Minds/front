Feature: payments
  As a customer
  I want to be able manage payments
  So that I can improve my experience on minds

  Scenario: should be able to add a new card
    Given I am logged in
    And I am on the Payment Methods page
    When I click Add a new card
    Then I should be redirected to stripe