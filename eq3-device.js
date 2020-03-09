const shell = require('shelljs');
const path = require('path');

module.exports = class Eq3Device {
    constructor(macAddress) {
        this.macAddress = macAddress;
        this.requestIsRunning = false;
    }

    getExecutable() {
        return path.join(__dirname, 'eq3.exp');
    }

    getInfo() {
        this.requestIsRunning = true;

        const command = `${this.getExecutable()} ${this.macAddress} mini-json`;
        const response = shell.exec(command).stdout;

        return this.getPromiseResponse(response);
    }

    setTemp(temp) {
        this.requestIsRunning = true;

        const command = `${this.getExecutable()} ${this.macAddress} temp ${temp}`;
        const response = shell.exec(command).stdout;

        return this.getPromiseResponse(response);
    }

    getPromiseResponse(response) {
        this.requestIsRunning = false;
        return Promise.resolve(JSON.parse(response));
    }
};
