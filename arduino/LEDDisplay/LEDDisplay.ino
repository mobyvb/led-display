const int rows = 7;
const int cols = 7;
int coordMap[rows][cols];
int coords[rows*cols][3];
boolean lightOn = true;
int step = 0;
int currentColor[3];
int layer1[1] = {24};
int layer2[8] = {18,23,32,17,31,16,25,30};
int layer3[16] = {8,9,10,11,12,19,22,33,15,26,29,36,37,38,39,40};
int layer4[24] = {0,1,2,3,4,5,6,42,43,44,45,46,47,48,7,20,21,34,35,13,14,27,28,41};
int currWheelPos = 0;

void setup() {
  Serial.begin(115200);
  pinMode(13, OUTPUT);
  
  for (int i=0; i<rows*cols; i++) {
    coords[i][0] = 0;
    coords[i][1] = 0;
    coords[i][2] = 0;
    int col = i / rows;
    int row = i % rows;
    if (col % 2 == 0) {
      row = rows - row - 1;
    }
    coordMap[col][row] = i;
  }
}

void loop() {
  for (int layer=0; layer<4; layer++) {
    int brightness = layer - step;
    
  }
  
  step++;
  if (step > 3) {
    step = 0;
  }
  
  setLightVals();
  
  if (lightOn) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
  lightOn = !lightOn;
  delay(30);
}

void setLightVals() {
  int prev[3];
  prev[0] = coords[layer3[0]][0];
  prev[1] = coords[layer3[0]][1];
  prev[2] = coords[layer3[0]][2];
  for (int i=0; i<24; i++) {
    coords[layer4[i]][0] = prev[0];
    coords[layer4[i]][1] = prev[1];
    coords[layer4[i]][2] = prev[2];
  }
  prev[0] = coords[layer2[0]][0];
  prev[1] = coords[layer2[0]][1];
  prev[2] = coords[layer2[0]][2];
  for (int i=0; i<16; i++) {
    coords[layer3[i]][0] = prev[0];
    coords[layer3[i]][1] = prev[1];
    coords[layer3[i]][2] = prev[2];
  }
  prev[0] = coords[layer1[0]][0];
  prev[1] = coords[layer1[0]][1];
  prev[2] = coords[layer1[0]][2];
  for (int i=0; i<8; i++) {
    coords[layer2[i]][0] = prev[0];
    coords[layer2[i]][1] = prev[1];
    coords[layer2[i]][2] = prev[2];
  }
  setWheelColor(currWheelPos);
  coords[layer1[0]][0] = currentColor[0];
  coords[layer1[0]][1] = currentColor[1];
  coords[layer1[0]][2] = currentColor[2];
  
  String lightArray = "[";
  for (int i=0; i<rows*cols; i++) {
    String r = String(coords[i][0]);
    String g = String(coords[i][1]);
    String b = String(coords[i][2]);
    lightArray += "["+r+","+g+","+b+"]";
    if (i+1 < rows*cols) {
      lightArray += ",";
    }
  }
  lightArray += "]";
  currWheelPos += 10;
  if (currWheelPos > 255) {
    currWheelPos -= 255;
  }
  
  Serial.println(lightArray);
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
void setWheelColor(byte wheelPos) {
  wheelPos = 255 - wheelPos;
  if(wheelPos < 85) {
    currentColor[0] = 255 - wheelPos * 3;
    currentColor[1] = 0;
    currentColor[2] = wheelPos * 3;
  } else if(wheelPos < 170) {
    wheelPos -= 85;
    currentColor[0] = 0;
    currentColor[1] = wheelPos * 3;
    currentColor[2] = 255 - wheelPos * 3;
  } else {
    wheelPos -= 170;
    currentColor[0] = wheelPos * 3;
    currentColor[1] = 255 - wheelPos * 3;
    currentColor[2] = 0;
  }
}
