'use strict';
const eq3device = require('./eq3-device');

module.exports = function(RED) {
    function Eq3BluetoothNode(config) {
        const node = this;
        RED.nodes.createNode(this, config);

        if (!node.device) {
            node.device = new eq3device(config.mac);
        }

        node.intervalId = setInterval(() => {
            if(node.device) {
                node.status({fill:"green",shape:"ring",text:"connected"});
                if (!node.device.requestInRunning) {
                    node.device.getInfo()
                        .then(res => {
                            const msg = {
                                payload: res
                            };
                            node.send(msg);
                        })
                }

            } else {
                node.status({fill:"red",shape:"ring",text:"disconnected"});
            }
        }, 10000);

        node.on('close', function(done) {
            clearInterval(node.intervalId);
            done()
        });

        node.on('input', function(msg) {
            console.log(msg);
            node.setCommand = () => {
                if (typeof msg.payload !== 'object') {
                    return;
                }

                switch (msg.payload.setState) {
                    case 'on':
                        node.device.turnOn();
                        break;
                    case 'off':
                        node.device.turnOff();
                        break;

                    case 'manual':
                        node.device.manualMode();
                        break;

                    case 'auto':
                        node.device.automaticMode();
                        break;
                    default:
                        break;
                }

                switch (msg.payload.boost) {
                    case '0':
                        node.device.setBoost(false);
                        break;
                    case '1':
                        node.device.setBoost(true);
                        break;

                    default:
                        break;
                }

                if (msg.payload.temp) {
                    node.device.setTemp(msg.payload.temp);
                }

            };

            if(!node.device) {
                RED.log.error('the specified device at ' + config.eq3device + ' has not been found yet');
                RED.log.warn('list of all available addressess will be retrieved...');
                // eq3device.discoverAll((device) => {
                //     if(!node.device || config.eq3device !==  device.address)
                //         RED.log.warn('found device at address ' + device.address);
                //
                //     if(!node.device && config.eq3device ===  device.address) {
                //         RED.log.info('device has found and configured!');
                //         global[config.eq3device] = device;
                //         node.device = global[config.eq3device]
                //     }
                // });
            } else {
                node.setCommand()
            }
        });
    }
    RED.nodes.registerType("eq3-bluetooth", Eq3BluetoothNode);
};
