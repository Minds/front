Feature: Notification
  As a customer
  I want to be able to generate and receive notifications
  
  Scenario: I generate a notification when creating a Supermind
    Given I log in as "supermind_sender"
    And I have clicked on the sidebar composer button
    And I make a supermind offer to "playwright_tests_user"
    And I log in as "playwright_tests_user"
    # And I wait for "10" seconds
    When I open my notifications
    And I click the first notification
    Then I should see "/supermind/" in current URL

  Scenario: I generate a notification when accepting a Supermind
    Given I log in as "supermind_sender"
    And I have clicked on the sidebar composer button
    And I make a supermind offer to "playwright_tests_user"
    And I log in as "playwright_tests_user"
    And I navigate via sidebar to the supermind console
    And I click "accept" on latest Supermind
    And I make a supermind reply
    And I log in as "supermind_sender"
    # And I wait for "10" seconds
    When I open my notifications
    And I click the first notification
    Then I should see "/newsfeed/" in current URL

  # # TODO: Uncomment when notification fires consistantly.
  # Scenario: I generate a notification when rejecting a Supermind
  #   Given I log in as "supermind_sender"
  #   And I have clicked on the sidebar composer button
  #   And I make a supermind offer to "playwright_tests_user"
  #   And I log in as "playwright_tests_user"
  #   And I navigate via sidebar to the supermind console
  #   And I click "decline" on latest Supermind
  #   And I log in as "supermind_sender"
  #   # And I wait for "10" seconds
  #   When I open my notifications
  #   And I click the first notification
  #   Then I should see "/supermind/" in current URL
