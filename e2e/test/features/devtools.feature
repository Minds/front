Feature: devtools
  As a developer
  I want to be able to interact with devtools page
  So users can successfully switch environments

  Scenario: devtools logged in switch to Staging
    Given I am logged in
    And I am on the devtools page
    When I switch environments to "staging"
    Then I see my environment as "staging"

  Scenario: devtools logged in switch to Production
    Given I am logged in
    And I am on the devtools page
    When I switch environments to "production"
    Then I see my environment as "production"

  Scenario: devtools logged out switch to Staging
    Given I am logged out
    And I am on the devtools page
    When I switch environments to "staging"
    Then I see my environment as "staging"

  Scenario: devtools logged out switch to Production
    Given I am logged out
    And I am on the devtools page
    When I switch environments to "production"
    Then I see my environment as "production"

