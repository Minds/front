Feature: login
  As a customer
  I want to be able to interact with login page
  So users can successfully login

  Scenario: login invalid credentials errors
    Given I am logged out
    And I am on Login page
    When I pass invalid credentials
      | username         | password          |
      | incorrectuser    | incorrectpassword | 
      | test_deleted_user| Minds@12345       |
    Then I am still on Login page
    And I see incorrect credentials error
  
  Scenario: login empty credentials errors
    Given I am logged out
    And I am on Login page
    When I pass empty credentials
    Then I am still on Login page
    And I see empty credentials error

  Scenario: login banned credentials errors
    Given I am logged out
    And I am on Login page
    When I pass banned credentials
    Then I am still on Login page

  Scenario: login successfully
    Given I am logged out
    And I am on Login page
    When I pass valid credentials
    Then I am taken to Home page
