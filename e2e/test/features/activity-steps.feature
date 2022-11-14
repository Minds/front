Feature: Activity Feature
  As a user
  I should be able to interact with various activity types 

  Scenario: Single image in a quote posts opens in a modal from newsfeed
    Given I am logged in
    And I am on the newsfeed
    And I create a post with text storage key "quote-media-modal-single-img-newsfeed"
    And I quote the activity with the storage text "quote-media-modal-single-img-newsfeed" and file names
      | filename |
      | image1.jpg |
    When I click the parent media for the quote post in the "newsfeed" with storage text "quote-media-modal-single-img-newsfeed"
    Then I should see the activity modal

  Scenario: Single image in a quote posts opens in a modal from single entity page
    Given I am logged in
    And I am on the newsfeed
    And I create a post with text storage key "quote-media-modal-single-img-single-entity-page"
    And I quote the activity with the storage text "quote-media-modal-single-img-single-entity-page" and file names
      | filename |
      | image1.jpg |
    When I click the timestamp for the activity with the storage key "quote-media-modal-single-img-single-entity-page" on "newsfeed"
    And I click the parent media for the quote post in the "single-entity-page" with storage text "quote-media-modal-single-img-single-entity-page"
    Then I should see the activity modal

  Scenario: Multi image in a quote posts opens in a modal from newsfeed
    Given I am logged in
    And I am on the newsfeed
    And I create a post with text storage key "quote-media-modal-multi-img-newsfeed"
    And I quote the activity with the storage text "quote-media-modal-multi-img-newsfeed" and file names
      | filename |
      | image1.jpg |
      | image2.jpg |
    When I click the parent media for the quote post in the "newsfeed" with storage text "quote-media-modal-multi-img-newsfeed"
    Then I should see the activity modal

  Scenario: Multi image in a quote posts opens in a modal from single entity page
    Given I am logged in
    And I am on the newsfeed
    And I create a post with text storage key "quote-media-modal-multi-img-single-entity-page"
    And I quote the activity with the storage text "quote-media-modal-multi-img-single-entity-page" and file names
      | filename |
      | image1.jpg |
      | image2.jpg |
    When I click the timestamp for the activity with the storage key "quote-media-modal-multi-img-single-entity-page" on "single-entity-page"
    And I click the parent media for the quote post in the "single-entity-page" with storage text "quote-media-modal-multi-img-single-entity-page"
    Then I should see the activity modal
