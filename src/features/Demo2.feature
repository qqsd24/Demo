Feature: Text input and retrieval

  Scenario: Open the App and interact with Alert Dialogs
    Given I launch the app
    When I click on the "App" button
    When I click on the "Alert Dialogs" button
    When I click on the "Text Entry dialog" button
    When I enter "Automation" into the "Name" field
    When I enter "!234Qwer" into the "Password" field
    Then I retrieve the entered Name and Password values and log them