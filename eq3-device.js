const shell = require('shelljs');

module.exports = class Eq3Device {
    constructor(macAddress) {
        this.macAddress = macAddress;
    }

    getInfo() {
        const command = `./eq3.exp ${this.macAddress} json`;
        const response = shell.exec(command).stdout;
        return response;
    }

    setTemp(temp) {
        const command = `./eq3.exp ${macAddress} temp ${temp}`;
        const response = shell.exec(command).stdout;
        return response;
    }
};
