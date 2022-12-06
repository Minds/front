Feature: boost
  As a customer
  I want to be able to interact boosts

  Scenario: should allow the user to make a valid cash newsfeed boost
    Given I am logged in
    And I am on the newsfeed
    When I create a post with text storage key "cash_newsfeed_boost"
    Then I can newsfeed boost the activity with storage key "cash_newsfeed_boost" for "cash"
    And I can revoke a newsfeed boost

  Scenario: should allow the user to make a valid tokens newsfeed boost
    Given I am logged in
    And I am on the newsfeed
    When I create a post with text storage key "token_newsfeed_boost"
    Then I can newsfeed boost the activity with storage key "token_newsfeed_boost" for "tokens"
    And I can revoke a newsfeed boost

  Scenario: should not allow the user to make an invalid boost
    Given I am logged in
    And I am on the newsfeed
    When I create a post with text storage key "invalid_newsfeed_boost"
    Then I see errors when setting invalid values when boosting the activity with storage key "invalid_newsfeed_boost"

  Scenario: should allow the user to revoke a valid cash newsfeed boost
    Given I am logged in
    And I am on the newsfeed
    When I create a post with text storage key "cash_newsfeed_boost"
    Then I can newsfeed boost the activity with storage key "cash_newsfeed_boost" for "cash"
    And I can revoke a newsfeed boost

  Scenario: should allow the user to revoke a valid tokens channel boost
    Given I am logged in
    When I am on my channel page
    Then I can create a channel boost for "tokens"
    And I can revoke a sidebar boost

  Scenario: should allow the user to revoke a valid cash channel boost
    Given I am logged in
    When I am on my channel page
    Then I can create a channel boost for "cash"
    And I can revoke a sidebar boost
