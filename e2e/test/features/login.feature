Feature: login
  As a customer
  I want to be able to interact with login page
  So users can successfully login

  Scenario: login successfully
    Given I am on Login page
    When I pass valid credentials
    Then I am taken to Home page
