int rows = 7;
int cols = 7;
int incr1 = 10;
boolean lightOn = true;
int startingBrightness = 0;
void setup() {
  Serial.begin(115200);
  pinMode(13, OUTPUT);
}

void loop() {
  int incr2 = 10;
  int currentBrightness = startingBrightness;
  String lightArray = "[";
  for (int i=0; i<rows*cols; i++) {
    String val = String(currentBrightness);
    lightArray += "["+val+",0,0]";
    if (i+1 < rows*cols) {
      lightArray += ",";
    }
    currentBrightness += incr2;
    if (currentBrightness > 255) {
      incr2 = -10;
      currentBrightness = 255;
    } else if (currentBrightness < 0) {
      incr2 = 10;
      currentBrightness = 0;
    }
  }
  lightArray += "]";
  startingBrightness += incr1;
  if (startingBrightness > 255) {
    incr1 = -10;
    startingBrightness = 255;
  } else if (startingBrightness < 0) {
    incr1 = 10;
    startingBrightness = 0;
  }
  Serial.println(lightArray);
  if (lightOn) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
  lightOn = !lightOn;
  delay(30);
}
