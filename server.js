// Express, logger and middleware
const express = require('express');
const async = require('async');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const r = require('rethinkdb');

const config = path.join(`${__dirname}/config.js`);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

// Store the db connection and start listening on a port
function startExpress(connection) {
  app.rdbConn = connection;
  app.listen(config.express.port);
  console.log(`Listening on port ${config.express.port}`);
}

/*
 * Connect to rethinkdb, create required assets
 * and then start express
 */
async.waterfall([
  function connect(callback) {
    r.connect(config.rethinkdb, callback);
  },
  // Create the database if required
  function createDatabase(connection, callback) {
    r.dbList().contains(config.rethinkdb.db).do((containsDb) => r.branch(
      containsDb,
      { created: 0 },
      r.dbCreate(config.rethinkdb.db),
    )).run(connection, (err) => {
      callback(err, connection);
    });
  },
  // Create the table if required
  function createTable(connection, callback) {
    r.tableList().contains('sensors').do((containsTable) => r.branch(
      containsTable,
      { created: 0 },
      r.tableCreate('sensors'),
    )).run(connection, (err) => {
      callback(err, connection);
    });
  },
  // Create the index if required
  function createIndex(connection, callback) {
    r.table('sensors').indexList().contains('date').do((hasIndex) => r.branch(
      hasIndex,
      { created: 0 },
      r.table('sensors').indexCreate('date'),
    ))
      .run(connection, (err) => {
        callback(err, connection);
      });
  },
  // Wait for the index to be ready
  function waitForIndex(connection, callback) {
    // eslint-disable-next-line no-unused-vars
    r.table('sensors').indexWait('date').run(connection, (err, result) => {
      callback(err, connection);
    });
  },
],
(err, connection) => {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }

  startExpress(connection);
});

// Connect to microcontroller
const five = require('johnny-five');

const mcu = new five.Board();
let led; let sensorEnvLight; let sensorWaterTemp;
// let sensorEnvTemp; let sensorEnvHumidity; let sensorWaterEC; let sensorWaterPH;

mcu.once('ready', () => {
  console.log('Microcontroller ready!');
  mcu.isReady = true;

  // Pulse led to indicate the microcontroller is running
  led = new five.Led(6);
  led.pulse(250);
  // Stop and turn off the led pulse loop after 2seconds
  mcu.wait(2000, () => {
    led.stop().off();
  });

  // Initialize sensors
  // Environment temperature sensor -> Analog PIN 1
  // sensorEnvTemp = new five.Thermometer({
  //  controller: "LM35",
  //  pin: "A1",
  //  freq: 250
  // })
  // Environment humidity sensor -> Analog PIN 2
  // sensorEnvHumidity = new five.Sensor({
  //  pin: "A2",
  //  freq: 250
  // })
  // Environment light sensor -> Analog PIN 5
  sensorEnvLight = new five.Light({
    pin: 'A5',
    freq: 250,
  });
  // Water temperature sensor -> Digital PIN 2
  sensorWaterTemp = new five.Thermometer({
    controller: 'DS18B20',
    pin: '2',
    freq: 250,
  });
}).on('error', (err) => {
  console.log('Unable to connect with microcontroller.');
  console.log(err);
});

// Get environment light sensor data
// eslint-disable-next-line no-shadow
function getEnvLight(sensorEnvLight) {
  return Math.round(sensorEnvLight.value / (1023 * 100));
}
// Get water temperature sensor data
// eslint-disable-next-line no-shadow
function getWaterTemp(sensorWaterTemp) {
  return Math.round(sensorWaterTemp.celsius);
}

// Get all historical data from a particular sensor
function getAllSensorData(sensor, callback) {
  r.table('sensors')
    .filter((m) => m.hasFields(sensor))
    .orderBy('date').map((m) => [m('date'), m(sensor) || 0])
    // eslint-disable-next-line consistent-return
    .run(app.rdbConn, (err, sensorData) => {
      if (err) {
        return callback(err);
      }
      sensorData.toArray(callback);
    });
}

// Get all historical environmental light data
function getAllEnvLightData(callback) {
  return getAllSensorData('env_light', callback);
}
// Get all historical water temperature data
function getAllWaterTemperatureData(callback) {
  return getAllSensorData('water_temp', callback);
}

// Save sensor data to database
function saveSensorData() {
  const sensorData = {
    date: new Date().getTime(),
    // env_temp: getEnvTemp(sensorEnvTemp),
    // env_humidity: getEnvHumidity(sensorEnvHumidity),
    env_light: getEnvLight(sensorEnvLight),
    water_temp: getWaterTemp(sensorWaterTemp),
    // water_ec: getWaterEC(sensorWaterEC),
    // water_ph: getWaterPH(sensorWaterPH)
  };

  r.table('sensors').insert(sensorData).run(app.rdbConn)
    .then()
    .error((err) => {
      console.log('Error saving sensor data');
      console.log(err);
    });
}

// Emit sensor data on 10s intervals and save to database
setInterval(() => {
  saveSensorData();
  console.log(getEnvLight(sensorEnvLight));
  console.log(getWaterTemp(sensorWaterTemp));
}, 10000);

// Routes
app.get('/env_light', (req, res) => {
  res.render('env_light');
});

app.get('/water_temp', (req, res) => {
  res.render('water_temp');
});

// Data routes
app.get('/api/env_light', (req, res) => {
  getAllEnvLightData((err, sensorData) => {
    if (err) { console.log(err); }

    res.write(JSON.stringify(sensorData));
    res.end();
  });
});

app.get('/api/water_temp', (req, res) => {
  getAllWaterTemperatureData((err, sensorData) => {
    if (err) { console.log(err); }

    res.write(JSON.stringify(sensorData));
    res.end();
  });
});

module.exports = app;
