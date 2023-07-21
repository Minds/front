Feature: Wallet Credits

Background:
    Given I am logged in
    And I navigate via sidebar to the wallet page
    And I click the credits tab

  Scenario: Verify that I can see my gift card balance summary on the credits tab
    Then I see my gift card balance summary

  Scenario: Verify that I can navigate to gift card transactions on the credit tab
    When I click to view a gift cards transactions
    Then I see the gift cards transaction history

  Scenario: Verify that I can see expired gift cards on the credit tab
    When I change the status filter to "Expired"
    Then I see my expired gift cards 
