const express = require('express');
const shell = require('shelljs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const device = '00:1A:22:12:3C:D4';

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.get('/status', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(shell.exec('./eq3.exp 00:1A:22:12:3C:D4 json').stdout);
});

app.post('/temp', (req, res) => {
  const macAdress = req.body.mac;
  const temp = req.body.temp;

  const command = `./eq3.exp ${macAdress} temp ${temp}`;

  const response = shell.exec(command).stdout;

  res.setHeader('Content-Type', 'application/json');
  //console.log(macAdress, temp);
  res.send(response);
});

 
app.listen(3000);
