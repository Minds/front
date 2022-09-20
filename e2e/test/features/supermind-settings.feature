Feature: Supermind Settings
  As a user I want to be able to change my Supermind Settings

  Scenario: Submitting a settings change
    Given I log in as "supermind_sender"
    And I am on the Supermind settings page
    And I fill out random Supermind settings values
    When I submit the Supermind settings form
    Then I should see an "success" toaster saying "Settings saved"
    And I should see that on refresh my settings persisted

  Scenario: Proposing an invalid settings change
    Given I log in as "supermind_sender"
    And I am on the Supermind settings page
    And I fill out invalid Supermind settings values
    Then I should see a disabled Supermind submit button
    And I should see Supermind form validation errors

  Scenario: Click to add bank
    Given I am logged in
    And I am on the Supermind settings page
    When I click the prompt to add my bank information
    Then I should see "/wallet/cash/settings" in current URL
