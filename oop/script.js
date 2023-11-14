"use strict";

// Coding challenge 1
const Car = function (name, speed) {
  this.name = name;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(this.speed);
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(this.speed);
};

const bmw = new Car("BMW", 120);
bmw.model = "m5";
const mercedes = new Car("Mercedes", 95);
console.log(bmw, mercedes);

bmw.accelerate();
bmw.accelerate();
mercedes.brake();
bmw.brake();

const CarEv = function (name, speed, battery) {
  Car.call(this, name, speed);
  this.battery = battery;
  console.log(this);
};

//Linking prototypes
CarEv.prototype = Object.create(Car.prototype);
CarEv.prototype.constructor = CarEv;
console.dir(CarEv.prototype.constructor);

CarEv.prototype.chargeBattery = function (chargeTo) {
  this.battery = chargeTo;
};

CarEv.prototype.accelerate = function () {
  this.speed += 20;
  this.battery--;
  console.log(
    `${this.name} going at ${this.speed}km/h, with a charge of ${this.battery}%`
  );
};

const bwmEv = new CarEv("bmw", 100, 58);
console.log(bwmEv);
bwmEv.accelerate();
bwmEv.chargeBattery(100);
bwmEv.accelerate();
bwmEv.brake();

///////////////////////////////////////////////

const PersonProto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },
};

const steven = Object.create(PersonProto);
console.log(steven);
PersonProto.newProp = 10;
console.log(steven);

// Coding challenge 2
class CarCl {
  constructor(brand, speed) {
    this.brand = brand;
    this.speed = speed;
  }

  get speedUS() {
    return this.speed / 1.6;
  }

  set speedUS(value) {
    this.speed = value * 1.6;
  }

  accelerate() {
    this.speed += 10;
    console.log(this.speed);
  }

  brake() {
    this.speed -= 5;
    console.log(this.speed);
  }
}

const toyota = new CarCl("Toyota", 100);
toyota.accelerate();
toyota.accelerate();
toyota.accelerate();
toyota.brake();
console.log(toyota.speedUS);
toyota.speedUS = 100;
console.log(toyota.speed);

// Classes inheritance
class EVCl extends CarCl {
  #batteryLevel;

  constructor(brand, speed, battery) {
    super(brand, speed);
    this.#batteryLevel = battery;
  }

  accelerate() {
    this.speed += 20;
    this.#batteryLevel--;
    console.log(
      `${this.name} going at ${this.speed}km/h, with a charge of ${
        this.#batteryLevel
      }%`
    );
    return this;
  }

  chargeBattery(chargeTo) {
    this.#batteryLevel = chargeTo;
    return this;
  }
}
