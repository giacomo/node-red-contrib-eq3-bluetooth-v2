const shell = require('shelljs');
const path = require('path');

module.exports = class Eq3Device {
    constructor(macAddress) {
        this.macAddress = macAddress;
    }

    getExecutable() {
        return path.join(__dirname, 'eq3.exp');
    }

    getInfo() {
        const command = `expect ${this.getExecutable()} ${this.macAddress} json`;
        const response = shell.exec(command).stdout;
        const json = JSON.parse(response);
        return Promise.resolve(json);
    }

    setTemp(temp) {
        const command = `expect ${this.getExecutable()} ${this.macAddress} temp ${temp}`;
        const response = shell.exec(command).stdout;
        return Promise.resolve(JSON.parse(response));
    }
};
