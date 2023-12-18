Feature: search
  As a customer
  I want to be able to interact with search page
  So users can successfully get search results

  # Scenario: valid search with search terms 
  #   Given I am logged in
  #   And I am on the search page
  #   When I type the search term
  #     | searchTerm       | 
  #     | minds            | 
  #     | c                |
  #     | #art             |
  #   Then I see search results

  Scenario: suggested groups with top search
    Given I am logged in
    And I am on the search page
    When I type the search term
      | searchTerm       | 
      | minds            | 
      | c                |
      | group             |
    Then I see suggested group results
