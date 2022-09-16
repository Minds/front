Feature: rewardsmarketing
  As a customer
  I want to be able to interact with rewards marketing page
  So users can successfully see rewards join button

  Scenario: should have a join rewards button
    Given I am logged in
    When I am on the rewards marketing page
    Then I see join rewards button
