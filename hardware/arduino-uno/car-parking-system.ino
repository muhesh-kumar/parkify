/*
  car-parking-system 

  Turns the servo motor 90 clockwise for 3 seconds when there is an high 
  input from IR sensor and raspberry pi.

  The servo is connected on pins 10, 11 of the arduino board.
  pin 11 is for the entry servo and pin 10 is for the exit servo gate

  The two IR sensors are connected on the pins 7 and 4,
  pin 7 for the entry IR and pin 4 for the exit IR.

  The pin 8 is for the input from the raspberry pi --> detection of car.

*/
#include<Servo.h>
Servo servo1;
Servo servo2;
// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(8,INPUT);
  pinMode(7, INPUT);
  pinMode(4, INPUT);
  pinMode(2, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(10, OUTPUT);
  digitalWrite(8, LOW);
  digitalWrite(7, LOW);
  digitalWrite(11, LOW);
  digitalWrite(10, LOW);
  digitalWrite(4, LOW);
  digitalWrite(2, LOW);
  servo1.attach(11); 
  servo2.attach(10);
}

// the loop function runs over and over again forever
void loop() {  
  
  if( (digitalRead(7) == HIGH) && digitalRead(8) == HIGH ) {       
    digitalWrite(2, HIGH);
    servo1.write(90); 
    delay(3000);
    servo1.write(0);
     
  }
  if(digitalRead(4) == HIGH) {
    servo2.write(90); 
    delay(3000);
    servo2.write(0);
  }  
  else {
    digitalWrite(2, LOW);
    servo1.write(0);
    servo2.write(0);    
  }  
}


