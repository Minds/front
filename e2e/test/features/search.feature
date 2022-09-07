Feature: search
  As a customer
  I want to be able to interact with search page
  So users can successfully get search results

  Scenario: valid search with search terms 
    Given I am logged in
    And I am on the search
    When I type the search term
      | searchTerm       | 
      | minds            | 
      | c                |
      | #art             |
    Then I see search results
      | searchPath                                    | 
      | discovery/search?q=minds&f=top&t=all          | 
      | discovery/search?q=minds&f=top&t=             |
      | discovery/search?q=%23art&f=top&t=all         |
