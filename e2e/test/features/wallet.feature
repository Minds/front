Feature: Wallet

  Scenario: Verify Uniqueness modal is visible when clicking 'Join Rewards' button
    Given I create a new user
    When I navigate via sidebar to the wallet page
    And I click the Join Rewards button
    Then I see the "[data-ref=in-app-verify-uniqueness-modal]" modal
    And I clear my cookies
