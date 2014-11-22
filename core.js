var Net = require('net');

var Host = '127.0.0.1';
var Port = 1234;

var Header = [];
var FlightData = {};

function WriteToLog(text) {
    var logDiv = $('#log')
    logDiv.empty()
    var newItem = $('<div class="logText">' + text + '</div>');
    logDiv.append(newItem);
}

function ConnectHandler(err) {
    if (!err) {
        WriteToLog('Connected: ' + Host + ':' + Port);
    }
}

function ErrorHandler(err) {
    WriteToLog(err.code)
}

function DataHander(data) {
    if (Header.length === 0) {
        Header = data.toString().split(",");
        WriteToLog('Header: ' + data);
        return
    }

    var dataSplit = data.toString().split(",");

    for (var i = 0; i < dataSplit.length; i++) {
        FlightData[Header[i]] = dataSplit[i];
    }

    WriteToLog('<div>' + 'Pitch: ' + FlightData["pitch"] + ' Roll: ' + FlightData["roll"] + ' Yaw: ' + FlightData["yaw"] + '</div>');

    UpdateUI()
}

function UpdateUI() {
    roll = FlightData["roll"] * (Math.PI / 180);
    pitch = FlightData["pitch"] * (Math.PI / 180);
    yaw = FlightData["yaw"] * (Math.PI / 180);

    var canvas = document.getElementById("canvas");
    canvas.height = 400;
    canvas.width = 400;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "blue";
    context.beginPath();
    context.arc(200, 200, 200, Math.PI + roll, 2 * Math.PI + roll);
    context.fill();

    context.fillStyle = "green";
    context.beginPath();
    context.arc(200, 200, 200, 0 + roll, Math.PI + roll);
    context.fill();
}

var client = new Net.Socket();

client.connect(Port, Host, ConnectHandler);
client.on('error', ErrorHandler);
client.on('data', DataHander);
client.on('close', CloseHandler);

function CloseHandler() {
    WriteToLog('Connection closed');
    WriteToLog('Retrying connection');
    client = new Net.Socket();
    client.connect(Port, Host, ConnectHandler);
    client.on('error', ErrorHandler);
    client.on('data', DataHander);
    client.on('close', CloseHandler);
}