Feature: supermind
  As a customer
  I want to be able to create a supermind
  So that other users can be incentivised to answer my questions

  Scenario: configure a supermind
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon on the composer toolbar
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
    And I accept the refund policy
    And I click the supermind creator save button
    Then I see the supermind is in progress

  # TODO - enable this once new user email verification works
  # Scenario: onboarding when configuring a supermind for the first time
  #   Given I create a new user
  #   And I close the "m-multiFactorAuth" modal
  #   And I close the "m-contentSettings" modal
  #   And I am on the newsfeed
  #   And I have clicked on the sidebar composer button
  #   When I click the supermind icon on the composer toolbar
  #   And I see an explainer screen modal
  #   Then I should see the supermind popout screen
  #   And I clear my cookies

  Scenario: clear a configured supermind
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon on the composer toolbar
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
    And I accept the refund policy
    And I click the supermind creator save button
    And I click the supermind icon on the composer toolbar
    And I click the supermind creator clear button
    Then I should not see the supermind is in progress

  Scenario: can not make a supermind after selecting nsfw option (Supermind-1)
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the nsfw icon on the composer toolbar
    And I select the 'Nudity' nsfw option
    And I click the nsfw composer popup save button
    Then I should see the nsfw icon is active on the composer toolbar
    And I should not see the supermind icon on the composer toolbar

  Scenario: can not mark as nsfw after creating a supermind (Supermind-1)
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon on the composer toolbar
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
    And I accept the refund policy
    And I click the supermind creator save button
    And I click the nsfw icon on the composer toolbar
    And I select the 'Nudity' nsfw option
    And I click the nsfw composer popup save button
    Then I should see an 'error' toaster saying 'You may not create an NSFW supermind at this time.'

  # Scenario: can not make a supermind after scheduling (Supermind-28)
  #   Given I am logged in
  #   And I am on the newsfeed
  #   And I have clicked on the sidebar composer button
  #   When I schedule a post
  #   And I select the 'Nudity' nsfw option
  #   And I click the nsfw composer popup save button
  #   Then I should see the nsfw icon is active on the composer toolbar
  #   And I should not see the supermind icon on the composer toolbar

  Scenario: can not schedule after creating a supermind (Supermind-28)
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon on the composer toolbar
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
    And I accept the refund policy
    And I click the supermind creator save button
    Then I do not have the ability to schedule a post

  # Scenario: can not make a supermind after selecting monetized (Supermind-2)
  #   Given I am logged in
  #   And I am on the newsfeed
  #   And I have clicked on the sidebar composer button
  #   When I click the nsfw icon on the composer toolbar
  #   And I select the 'Nudity' nsfw option
  #   And I click the nsfw composer popup save button
  #   Then I should see the nsfw icon is active on the composer toolbar
  #   And I should not see the supermind icon on the composer toolbar

  Scenario: can not monetize after creating a supermind (Supermind-2)
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon on the composer toolbar
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
    And I accept the refund policy
    And I click the supermind creator save button
    Then I do not see the monetize icon on the composer toolbar

  Scenario: creating a supermind from someone elses channel page
    Given I am logged in
    And I am on the 'minds' channel page
    When I click on the channel supermind button
    Then I should see prefilled supermind details in the composer

  Scenario: creating a supermind from my activity post
    Given I am logged in
    And I am on the newsfeed
    And I have created a new post via the newsfeed
    When I click the activity post supermind icon on the toolbar
    Then I should see prefilled supermind details excluding my username as target user in the composer

  Scenario: can not make a supermind if I do not confirm
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon on the composer toolbar
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
    And I accept the refund policy
    And I click the supermind creator save button
    And I enter 'hello world. this should not allow me to post.' in the composer text area
    And I click the post button
    And I click the cancel button on the confirmation modal
    Then I should still see the composer modal open

  Scenario: I have a feed notice indicating when I have pending Supermind offers
    Given I log in as "supermind_sender"
    And I have clicked on the sidebar composer button
    When I make a supermind offer
    And I log in as "playwright_tests_user"
    And I see the feed notice for "supermind_pending"
    And I click the feed notice primary action
    Then I should see "/supermind/inbox" in current URL
