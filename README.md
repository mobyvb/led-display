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
If you want to test the code on the Arduino, make sure your Arduino is plugged into your computer and has the LEDDisplay code uploaded.

Otherwise, animation code in [noarduino.js](server/noarduino.js) will run.

From [server/](server) run `node app.js` and go to [http://localhost:3000](http://localhost:3000) to view the simulation in your browser.
