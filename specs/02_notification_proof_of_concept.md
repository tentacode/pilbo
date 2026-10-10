# Notifications proof of concept

Notifications are the most vital part of the application, it does not make any sense to work on the project if it does not work as expected.

We just need a proof of concept to validate that it will work as expected.

What we need is:

* [ ] A small UI text with a state of "Med has been taken" or "You need to take your meds". Based on a fake state "shouldTakeMeds", just a state that will be reset when the app is launched. Default to true.
* [ ] A button "I took my meds" that clears any notifications. When clicked the "shouldTakeMeds" state is set to false. The button now says "Reset timers".
* [ ] When the app is launched OR the "Reset timers" button is clicked, 5 notifications are planned every 1 minutes.
* [ ] The notification should have a message "It's time for your meds: 1x lithium 50mg, 1x lamictal 25mg".
* [ ] The notification should have a custom sound, any sound is ok but it should not be a sound shipped with iOS, a custom wave file (you can download any "beep", it does not really matter). If a custom sound is not possible, you need to tell me.
* [ ] If I close the app shortly after openning it, I should see the 5 notifications 1 min appart.
* [ ] It should work when I build on my iPhone.
* [ ] I can test each of the notifications priority: Passive, Active or Time Sensitive. There should be a variable to switch from one to another during test.

The code should be very simple and readable, with explaination if needed (and only if it's not self explanatory).

There might be some code that will be needed later, but it's just a proof of concept and it will probably be thrown to the bin after, so don't worry too much about it.