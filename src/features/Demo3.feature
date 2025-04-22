Feature: Google Maps Navigation

  Scenario: Navigate from Marina Bay Sands to Sentosa
    Given I set the device location to Marina Bay Sands
    When I open Google Maps
    When I search for "Sentosa"
    Then I should see directions to Sentosa