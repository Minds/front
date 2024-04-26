Feature: Boost Console
  As a user I want to be able to access and interact with the Boost Console

  Scenario: Should be redirected to login if not logged in
    Given I am logged out
    And I am on the Boost Console with location query string param "feed"
    Then I should see "/login" in current URL

  Scenario: Switching tabs from feed to sidebar
    Given I am logged in
    And  I am on the Boost Console with location query string param "feed"
    When I click to change Boost Console tabs to "Channel + groups"
    Then I should see "location=sidebar" in current URL
    And I should see my Boost Console "Channel + groups" location tab

  Scenario: Switching tabs from sidebar to feed
    Given I am logged in
    And  I am on the Boost Console with location query string param "sidebar"
    When I click to change Boost Console tabs to "Posts"
    Then I should see "location=feed" in current URL
    And I should see my Boost Console "Posts" location tab

  Scenario: Should see all states by default
    Given I am logged in
    And I am on the Boost Console with location query string param "feed"
    Then I should see my Boost Console state filter says "All"

  Scenario: Switching state filter to pending
    Given I am logged in
    And I am on the Boost Console with location query string param "feed"
    When I click to change Boost Console state filter to "Pending"
    Then I should see my Boost Console state filter says "Pending"

  Scenario: Switching state filter to approved
    Given I am logged in
    And I am on the Boost Console with location query string param "feed"
    When I click to change Boost Console state filter to "Approved"
    Then I should see my Boost Console state filter says "Approved"

  Scenario: Switching state filter to rejected
    Given I am logged in
    And I am on the Boost Console with location query string param "feed"
    When I click to change Boost Console state filter to "Rejected"
    Then I should see my Boost Console state filter says "Rejected"

  Scenario: Switching state filter to completed
    Given I am logged in
    And I am on the Boost Console with location query string param "feed"
    When I click to change Boost Console state filter to "Completed"
    Then I should see my Boost Console state filter says "Completed"
