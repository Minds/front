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
    And I click the supermind creator save button
    Then I see the supermind is in progress
  
  Scenario: clear a configured supermind
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I click the supermind icon on the composer toolbar
    Then I should see the supermind popout screen
    When I enter a target username with value 'minds'
    And I accept the supermind terms
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
    And I click the supermind creator save button
    Then I do not see the monetize icon on the composer toolbar
