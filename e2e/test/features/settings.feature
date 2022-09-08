Feature: settings
  As a customer
  I want to be able to interact with settings page
  So users can successfully see settings options

  Scenario: should display all top nested menus within settings
    Given I am logged in
    And I am on the settings page
    Then I see top nested settings menus

  Scenario: should display all accounts submenus within settings
    Given I am logged in
    And I am on the settings page
    When I am on the accounts settings page
    Then I see account submenus within settings

  Scenario: should display all pro submenus within settings
    Given I am logged in
    And I am on the settings page
    When I am on the pro settings page
    Then I see pro submenus within settings

  Scenario: should display all security submenus within settings
    Given I am logged in
    And I am on the settings page
    When I am on the security settings page
    Then I see security submenus within settings

  Scenario: should display all billing submenus within settings
    Given I am logged in
    And I am on the settings page
    When I am on the billing settings page
    Then I see billing submenus within settings

  Scenario: should display all other submenus within settings
    Given I am logged in
    And I am on the settings page
    When I am on the other settings page
    Then I see other submenus within settings
