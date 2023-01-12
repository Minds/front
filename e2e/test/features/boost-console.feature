Feature: BoostConsole
  As a user I want to be able to access and interact with the Boost Console

  Scenario: Should be redirected to login if not logged in
    Given I am logged out
    And I am on the Boost Console "Newsfeed" location tab
    Then I should see "/login" in current URL

  Scenario: Switching tabs from newsfeed to sidebar
    Given I am logged in
    And I am on the Boost Console "Newsfeed" location tab
    When I click to change tabs to "Sidebar"
    Then I should see "location=sidebar" in current URL
    And I should see my Boost Console "Sidebar" location tab

  Scenario: Switching tabs from sidebar to newsfeed
    Given I am logged in
    And I am on the Boost Console "Sidebar" location tab
    When I click to change tabs to "Newsfeed"
    Then I should see "location=newsfeed" in current URL
    And I should see my Boost Console "Newsfeed" location tab

  Scenario: Should see all states by default
    Given I am logged in
    And I am on the Boost Console "Newsfeed" location tab
    Then I should see my Boost Console state filter says "All"

  Scenario: Switching state filter to pending
    Given I am logged in
    And I am on the Boost Console "Newsfeed" location tab
    When I click to change Boost Console state filter to "Pending"
    Then I should see my Boost Console state filter says "Pending"

  Scenario: Switching state filter to approved
    Given I am logged in
    And I am on the Boost Console "Newsfeed" location tab
    When I click to change Boost Console state filter to "Approved"
    Then I should see my Boost Console state filter says "Approved"

  Scenario: Switching state filter to rejected
    Given I am logged in
    And I am on the Boost Console "Newsfeed" location tab
    When I click to change Boost Console state filter to "Rejected"
    Then I should see my Boost Console state filter says "Rejected"

  Scenario: Switching state filter to completed
    Given I am logged in
    And I am on the Boost Console "Newsfeed" location tab
    When I click to change Boost Console state filter to "Completed"
    Then I should see my Boost Console state filter says "Completed"

#   Scenario: A boost is created and rejected
#     Given I log in as "boost_sender"
#     And I have clicked on the sidebar composer button
#     When I make a boost offer
#     And I log in as "playwright_tests_user"
#     And I navigate via sidebar to the boost console
#     And I click "decline" on latest Boost
#     Then the latest boost offer should be "declined"

#   Scenario: A boost is created and approved
#     Given I log in as "boost_sender"
#     And I have clicked on the sidebar composer button
#     When I make a boost offer
#     And I log in as "playwright_tests_user"
#     And I navigate via sidebar to the boost console
#     And I click "accept" on latest Boost
#     And I make a boost reply
#     Then the latest boost offer should be "accepted"
#     Then I should see an 'success' toaster saying 'Your Boost reply was posted, and you’ve collected the offer.'
#     And on clicking the view reply button I am sent to the single entity page


# Scenario: A boost is created and cancelled

