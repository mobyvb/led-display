/*  Spectrum Analyzer using Rainbowduino, MSGEQ7 IC and 8x8 RGB LED Array
    Rainbowduino = Ardiuno w/ ATmega328 16MHz
    Analog signal is filtered by the MSGEQ7 into 7 channels of DC peak values

*/

int  AUDIO = 0; // ADC channel connected to the DC output pin (3)
int  STROBE = 7; // digital pin connected to the Strobe line (4)
int  RESET = 6; // digital pin connected to the Reset Line (7)
int  SAMPLES = 16; // number of analog samples to take into the average
int  OFFSET = 37; // the DC offset seen on the output of the MSGEQ7 (300 to 600mV nominal)

unsigned int output[8];  // LED output array

byte logLed;
void setup()
{
  Serial.begin(115200);
  pinMode(STROBE, OUTPUT);
  pinMode(RESET, OUTPUT);
  
  digitalWrite(RESET, LOW);   // start with both outputs low
  digitalWrite(STROBE, LOW);  // 
  
  delay(1000);  //wait 1 seconds
  
  digitalWrite(RESET, HIGH);  // set the Reset line high
  delay(1);  //wait 1 millisecond
  digitalWrite(RESET, LOW);  // set the Reset line low 
  delay(1);  //wait 1 millisecond - chip now ready for strobing through the outputs

}

void loop() {

  int peakAverage = 0;
  int spectrumValue = 0;
  int averageValue = 0;
  
  String lightArray = "[";
  boolean goingUp = true;

  digitalWrite(RESET, HIGH);  // set the Reset line high
  delayMicroseconds(200);  //wait 200 microseconds
  digitalWrite(RESET, LOW);  // set the Reset line low 
  delayMicroseconds(200);  //wait 200 microsecond - chip now ready for strobing through the outputs

  for (byte i = 0; i < 7; i++){   // cycle through the seven channels
    digitalWrite(STROBE, HIGH); // Strobe High to switch to the next analog channel
    delay(1);     // wait 1 milliseconds to allow the output to settle - minimum 36 usec
    digitalWrite(STROBE, LOW);  // set the Strobe line low for the next time
    delay(1);    // wait 1 milliseconds for the analog signal to stabilize
    averageValue = 0;    //reset average
    for (byte y = 0; y < SAMPLES; y++){  //sample analog channel
      spectrumValue = analogRead(AUDIO); // get the audio peak DC value for this spectrum
      spectrumValue = spectrumValue - OFFSET; // subtract DC offset that appears on the output
      if(spectrumValue < 0){
        spectrumValue = 0;
      }
      averageValue = averageValue + spectrumValue;
    }
    
    averageValue = averageValue / SAMPLES;  //calculate average
    
    logLed = logPeak(averageValue);  //log-scale into range for the display
    
    peakAverage = peakAverage + logLed;  //accumulate the peaks across all channels
  
    if (goingUp) {
      for (int i=0; i<logLed-1; i++) {
        lightArray += "[255, 255, 0],";
      }
      for (int i=0; i<8-logLed; i++) {
        lightArray += "[0,0,0],";
      }
    } else {
      for (int i=0; i<8-logLed; i++) {
        lightArray += "[0,0,0],";
      } 
      for (int i=0; i<logLed-1; i++) {
        lightArray += "[255, 255, 0],";
      }
    }
    goingUp = !goingUp;
  }
  
  peakAverage = peakAverage / 8;   //average the peaks
  
//  Serial.println("-----------");
//  for (int i = 0; i < peakAverage; i++) {
//    Serial.print("[]");
//  }

  lightArray += "[0,0,0]]";
  Serial.println(lightArray);
}



// logPeak: returns an interger value of 0 to 8 based on the input value in the range of 0 to 1024
//   intended to map a peak reading from analog audio to 1 of 8 LEDS in a psuedo log scale
//   log values are approximate and tuned by eye :)
//   straight linear would equal the input value divided by 100 and these values are
//   a blend between linear and log
//     Note: Original log values were = 600, 300, 150, 63, 32, 16, 8, 4

byte logPeak(int peak){
  if (peak > 725){      //+175
    return 8;
  }
  else if(peak > 550){  //+150
    return 7;
  }
  else if(peak > 400){  //+125
    return 6;
  }
  else if(peak > 275){  //+100
    return 5;
  }
  else if(peak > 175){  //+75
    return 4;
  }
  else if(peak > 100){  //+50
    return 3;
  }
  else if(peak > 50){  //+25
    return 2;
  }
  else if(peak > 25){  //baseline
    return 1;
  }
  return 0;
}
