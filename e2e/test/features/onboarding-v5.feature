Feature: Onboarding V5
  As a new user
  I should be able to onboard

Scenario: Verify that onboarding is displayed when accessed from the homepage Join Now button
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/"
  And I open register form from topbar
  When I submit the register form with random data
  Then I see the onboarding v5 modal 
  And I clear my cookies

Scenario: Verify that onboarding is displayed when accessed from the register page
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  When I submit the register form with random data
  Then I see the onboarding v5 modal 
  And I clear my cookies

Scenario: Verify that you can successfully verify email
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  When I click the onboarding v5 continue button and wait for progress to save
  Then I see the onboarding v5 tag selector panel
  And I clear my cookies

Scenario: Verify that an invalid email code throws an error when verifying email 
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I fill out onboarding v5 email code input with "123456"
  When I click the onboarding v5 continue button
  Then I should see an 'error' toaster saying 'Incorrect email confirmation code.'
  And I clear my cookies

Scenario: Verify that you can successfully select tags
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  And I click the onboarding v5 continue button and wait for progress to save
  And I select "3" onboarding v5 tags
  When I click the onboarding v5 continue button and wait for progress to save
  Then I see the onboarding v5 survey panel
  And I clear my cookies

Scenario: Verify that Continue button is disabled when tags are not selected
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  When I click the onboarding v5 continue button and wait for progress to save
  Then I see the onboarding v5 continue button is disabled
  And I clear my cookies

Scenario: Verify that you can successfully add a new tag when onboarding
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  And I click the onboarding v5 continue button and wait for progress to save
  And I select "2" onboarding v5 tags
  When I add a new onboarding v5 tag with the text "Test"
  Then I see an onboarding v5 tag with the text "Test"
  And I clear my cookies

Scenario: Verify that you can successfully select a survey option
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  And I click the onboarding v5 continue button and wait for progress to save
  And I select "3" onboarding v5 tags
  And I click the onboarding v5 continue button and wait for progress to save
  And I select the onboarding v5 survey option at index "0"
  When I click the onboarding v5 continue button and wait for progress to save
  Then I see the onboarding v5 user selector panel
  And I clear my cookies

Scenario: Verify that Continue button is disabled when a survey option is not selected
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  And I click the onboarding v5 continue button and wait for progress to save
  And I select "3" onboarding v5 tags
  And I click the onboarding v5 continue button and wait for progress to save
  When I see the onboarding v5 survey panel
  Then I see the onboarding v5 continue button is disabled
  And I clear my cookies

# Scenario: Verify that you can successfully subscribe to channel onboarding suggestions
#   Given I am logged out
#   And I set up registration bypass cookies
#   And I navigate to "/register"
#   And I submit the register form with random data
#   And I set an email verification bypass cookie for code "000000"
#   And I fill out onboarding v5 email code input with "000000"
#   And I click the onboarding v5 continue button and wait for progress to save
#   And I select "3" onboarding v5 tags
#   And I click the onboarding v5 continue button and wait for progress to save
#   And I select the onboarding v5 survey option at index "0"
#   And I click the onboarding v5 continue button and wait for progress to save
#   And I select the onboarding v5 recommendation at index "0"
#   And I click the onboarding v5 continue button and wait for progress to save
#   Then I see the onboarding v5 group selector panel
#   And I clear my cookies

Scenario: Verify that you can successfully subscribe to group onboarding suggestions
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  And I click the onboarding v5 continue button and wait for progress to save
  And I select "3" onboarding v5 tags
  And I click the onboarding v5 continue button and wait for progress to save
  And I select the onboarding v5 survey option at index "0"
  And I click the onboarding v5 continue button and wait for progress to save
    And I click the onboarding v5 step skip button
  And I select the onboarding v5 recommendation at index "0"
    And I click the onboarding v5 continue button and wait for progress to save
  Then I see the onboarding v5 completion panel for a short period
  And I clear my cookies

Scenario: Verify that on refresh progress resumes
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  And I click the onboarding v5 continue button and wait for progress to save
  When I see the onboarding v5 tag selector panel
  And I refresh the page
  Then I see the onboarding v5 tag selector panel
  And I clear my cookies

Scenario: Verify that you can navigate the feature carousel with arrows
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  And I click the onboarding v5 continue button and wait for progress to save
  And I select "3" onboarding v5 tags
  And I click the onboarding v5 continue button and wait for progress to save
  When I click feature carousel right arrow
  And I see feature carousel dot at index "1" is active
  And I click feature carousel right arrow
  And I see feature carousel dot at index "2" is active
  And I click feature carousel left arrow
  And I see feature carousel dot at index "1" is active
  And I click feature carousel left arrow
  Then I see feature carousel dot at index "0" is active
  And I clear my cookies

Scenario: Verify that I can navigate the feature carousel by dots
  Given I am logged out
  And I set up registration bypass cookies
  And I navigate to "/register"
  And I submit the register form with random data
  And I set an email verification bypass cookie for code "000000"
  And I fill out onboarding v5 email code input with "000000"
  And I click the onboarding v5 continue button and wait for progress to save
  And I select "3" onboarding v5 tags
  And I click the onboarding v5 continue button and wait for progress to save
  When I click feature carousel dot at index "1"
  And I see feature carousel dot at index "1" is active
  And I click feature carousel dot at index "2"
  And I see feature carousel dot at index "2" is active
  And I click feature carousel dot at index "0"
  Then I see feature carousel dot at index "0" is active
  And I clear my cookies
