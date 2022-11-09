Feature: Supermind Console
  As a user I want to be able to access and interact with the Supermind Console

  Scenario: should be redirected to login if not logged in
    Given I am logged out
    And I am on the Supermind Console "inbox" page
    Then I should see "/login" in current URL

  Scenario: Switching tabs from inbox to outbox
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change tabs to "Outbound"
    Then I should see "/supermind/outbox" in current URL
    And I should see my Supermind Console "outbox"

  Scenario: Checking outbox and then inbox
    Given I am logged in
    And I am on the Supermind Console "outbox" page
    When I click to change tabs to "Inbound"
    Then I should see "/supermind/inbox" in current URL
    And I should see my Supermind Console "inbox"

  Scenario: Should see Pending filter as default for inbox
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    Then I should see my Supermind Console status filter says "Pending"

  Scenario: Should see All filter as default for outbox
    Given I am logged in
    And I am on the Supermind Console "outbox" page
    Then I should see my Supermind Console status filter says "All"

  Scenario: Switching filter to all
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change Supermind Console status filter to "All" with value ""
    Then I should see my Supermind Console status filter says "All"

  Scenario: Switching filter to accepted
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change Supermind Console status filter to "Accepted" with value "2"
    Then I should see my Supermind Console status filter says "Accepted"

  Scenario: Switching filter to revoked
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change Supermind Console status filter to "Revoked" with value "3"
    Then I should see my Supermind Console status filter says "Revoked"

  Scenario: Switching filter to rejected (declined)
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change Supermind Console status filter to "Declined" with value "4"
    Then I should see my Supermind Console status filter says "Declined"

  Scenario: Switching filter to failed payment
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change Supermind Console status filter to "Failed Payment" with value "5"
    Then I should see my Supermind Console status filter says "Failed Payment"

  Scenario: Switching filter to failed
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change Supermind Console status filter to "Failed" with value "6"
    Then I should see my Supermind Console status filter says "Failed"
  
  Scenario: Switching filter to expired
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click to change Supermind Console status filter to "Expired" with value "7"
    Then I should see my Supermind Console status filter says "Expired"

  Scenario: Clicking add bank prompt
    Given I am logged in
    And I am on the Supermind Console "inbox" page
    When I click the prompt to add my bank information
    Then I should see "connect.stripe.com" in current URL

  # TODO - enable this once new user email verification works
  # Scenario: onboarding when going to the supermind console inbox for the first time
  #   Given I create a new user
  #   When I navigate via sidebar to the supermind console
  #   And I see the supermind reply onboarding modal
  #   And I click the action button in the Supermind onboarding modal
  #   Then I should see my Supermind Console "inbox"
  #   And I clear my cookies

  Scenario: A supermind is created and declined
    Given I log in as "supermind_sender"
    And I have clicked on the sidebar composer button
    When I make a supermind offer
    And I log in as "playwright_tests_user"
    And I navigate via sidebar to the supermind console
    And I click "decline" on latest Supermind
    Then the latest supermind offer should be "declined"

  Scenario: A supermind is created and accepted
    Given I log in as "supermind_sender"
    And I have clicked on the sidebar composer button
    When I make a supermind offer
    And I log in as "playwright_tests_user"
    And I navigate via sidebar to the supermind console
    And I click "accept" on latest Supermind
    And I make a supermind reply
    Then the latest supermind offer should be "accepted"
    Then I should see an 'success' toaster saying 'Your Supermind reply was posted, and you’ve collected the offer.'
    And on clicking the view reply button I am sent to the single entity page

  Scenario: An attempt is made to create an NSFW supermind reply
    Given I log in as "supermind_sender"
    And I have clicked on the sidebar composer button
    When I make a supermind offer
    And I log in as "playwright_tests_user"
    And I navigate via sidebar to the supermind console
    And I click "accept" on latest Supermind
    And I try to make an NSFW supermind reply
    Then I should see an 'error' toaster saying 'You may not create an NSFW supermind at this time.'
