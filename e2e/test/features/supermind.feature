Feature: supermind
  As a customer
  I want to be able to create a supermind
  So that other users can be incentivised to answer my questions

  Scenario: configure a supermind
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
    And I click the supermind creator save button
    Then I see the supermind is in progress
  
  Scenario: clear a configured supermind
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
    And I click the supermind creator save button
    And I click the supermind icon
    And I click the supermind creator clear button
    Then I should not see the supermind is in progress

  # Scenario: not have an NSFW supermind

  # Scenario: not have a scheduled supermind

  # Scenario: not have a monetized supermin
