# led-display
A library for displaying patterns on an LED grid and viewing simulations of those patterns in the browser

##Cloning and Installing
```
$ git@github.com:mobyvb/led-display.git
$ cd led-display
$ npm install
```
If `npm install` doesn't work, sudo it!

##Running on an Arduino
In your Arduino software, open [LEDDisplay.ino](arduino/LEDDisplay/LEDDisplay.ino) and upload to your Arduino.

##Simulating in the browser
Make sure your Arduino is plugged into your computer and has the LEDDisplay code uploaded.

Change [line 22 of app.js](server/app.js#L22) to match the serial port of your Arduino (in your Arduino software, go to *Tools > Serial Port > whatever is selected*).

From [server/](server) run `node app.js` and go to [http://localhost:3000](http://localhost:3000) to view the simulation in your browser.
