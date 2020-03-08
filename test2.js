'use strict';

const eq3device = require('./eq3-device');

const testDevice = new eq3device('00:1A:22:12:3C:D4');


console.log(testDevice.getInfo());
