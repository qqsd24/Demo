Feature: App menu interaction
@NonService
  Scenario: Open the App and click the "App" button
    Given I launch the app
    When I click on the "App" button
    Then I should see the "API Demos" screen