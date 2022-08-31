Feature: Composer
  As a user
  I want to create activity posts
  So that I can share content

  Scenario: one attachments by upload button
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I add files via the upload button
      | filename |
      | image1.jpg |
    Then I should see 1 previews of my selected imaged
    When I click the post button
    Then I am able to create the post

  Scenario: two attachments by upload button
    Given I am logged in
    And I am on the newsfeed
    And I have clicked on the sidebar composer button
    When I add files via the upload button
      | filename |
      | image1.jpg |
      | image2.jpg |
    Then I should see 2 previews of my selected imaged
    When I click the post button
    Then I am able to create the post