Feature: App menu interaction

  Scenario: Open the App and click the "App" button
    Given I launch the app
    When I click on the App button
    When I click on the Alert Dialogs button
    When I click on the List Dialog button
    Then The correct dialog message should be displayed