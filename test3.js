const arrayBufferToHex = require('array-buffer-to-hex');
const noble = require('@abandonware/noble');

const serviceUuid = "3e135142654f9090134aa6ff5bb77046";
const writeUuid = "3fa4585ace4a3baddb4bb8df8179ea09";
const notificationUuid = "d0e8434dcd290996af416c90f4e0eb2a";

const SERVICE_ID = serviceUuid;
const WRITE_UUID = writeUuid;
const NOTIFY_UUID = notificationUuid;

const status = {
    manual: 1,
    holiday: 2,
    boost: 4,
    dst: 8,
    openWindow: 16,
    unknown: 32,
    unknown2: 64,
    lowBattery: 128,
};

noble.on('stateChange', state => {
    if (state === 'poweredOn') {
        console.log('Scanning');
        noble.startScanning([SERVICE_ID]);
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', peripheral => {
    if (peripheral.advertisement.localName === 'CC-RT-BLE' && peripheral.uuid === '001a22123cd4') {
        noble.stopScanning();
        const name = peripheral.advertisement.localName;
        console.log(`Connecting to '${name}' ${peripheral.id}`);
        connectAndSetUp(peripheral);
    }
});

function connectAndSetUp (peripheral) {
    peripheral.connect(error => {
        console.log('Connected to', peripheral.id);

        // specify the services and characteristics to discover
        const serviceUUIDs = [SERVICE_ID];
        const characteristicUUIDs = [WRITE_UUID, NOTIFY_UUID];

        peripheral.discoverSomeServicesAndCharacteristics(
            serviceUUIDs,
            characteristicUUIDs,
            onServicesAndCharacteristicsDiscovered
        );
    });

    peripheral.on('disconnect', () => console.log('disconnected'));
}

function onServicesAndCharacteristicsDiscovered (error, services, characteristics) {
    console.log('Discovered services and characteristics');

    const writeCharacteristic = characteristics[0];
    const notifyCharacteristic = characteristics[1];
    //
    // // data callback receives notifications
    // notifyCharacteristic.notify(true);
    notifyCharacteristic.on('data', (data, isNotification) => {
        const newData = parseInfo(data);
        console.log(newData);
    });

    notifyCharacteristic.subscribe((error) => {
        if (error) {
            console.error('Error subscribing to notifyCharacteristic');
        } else {
            console.log('Subscribed for notifyCharacteristic notifications');
        }
    });
    //

    //
    // // create an interval to send data to the service
    let count = 0;
    setInterval(() => {
        count++;
        const message = getPayload();
        console.log(`Sending:  '${message}' ${count}`);
        writeCharacteristic.write(message);
    }, 2500);
}

function getPayload() {
    const date = new Date();
    const b = Buffer.alloc(7);
    b[0] = 3;
    b[1] = (date.getFullYear() % 100);
    b[2] = (date.getMonth() + 1);
    b[3] = date.getDate();
    b[4] = date.getHours();
    b[5] = date.getMinutes();
    b[6] = date.getSeconds();
    return b;
}

function parseInfo(info) {
    const statusMask = info[2];
    const valvePosition = info[3];
    const targetTemperature = info[5] / 2;

    return {
        status: {
            manual: (statusMask & status.manual) === status.manual,
            holiday: (statusMask & status.holiday) === status.holiday,
            boost: (statusMask & status.boost) === status.boost,
            dst: (statusMask & status.dst) === status.dst,
            openWindow: (statusMask & status.openWindow) === status.openWindow,
            lowBattery: (statusMask & status.lowBattery) === status.lowBattery,
        },
        valvePosition,
        targetTemperature,
    };
}
