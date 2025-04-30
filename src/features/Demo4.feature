Feature: Google App Login

Scenario: Login and Logout
  Given "deviceA", "deviceB" starts the Google Play app
  When Tap on userName on "deviceA"
  When Tap on userName on "deviceB"
  When Tap the Expand button on "deviceA" then tap Add another account
  When Tap the Expand button on "deviceB" then tap Add another account
  When Enter "testqamvl1@gmail.com" in the Email field on "deviceA" then tap Next
  When Enter "testqamvl2@gmail.com" in the Email field on "deviceB" then tap Next
  When Enter "Testqa123!" in the passowrd field on "deviceA" then tap Next
  When Enter "Testqa123!" in the passowrd field on "deviceB" then tap Next
  Then Check if the "I agree" button is displayed on "deviceA"
  Then Check if the "I agree" button is displayed on "deviceB"
  