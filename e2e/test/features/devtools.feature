Feature: devtools
  As a developer
  I want to be able to interact with devtools page
  So users can successfully switch environments

  Scenario: devtools logged in switch to Staging
    Given I am logged in on the devtools page
    When I switch environments to Staging
    Then I see my environment as Staging

  Scenario: devtools logged in switch to Canary
    Given I am logged in on the devtools page
    When I switch environments to Canary
    Then I see my environment as Canary
