function updateSensorData() {
    document.getElementById('nitrates').innerText = '12';
    document.getElementById('sulfates').innerText = '15';
    document.getElementById('ph').innerText = '7.2';
    document.getElementById('metals').innerText = '0.3';
}

function controlLights(action) {
    console.log(`Luces ${action}`);
}

function controlFan(action) {
    console.log(`Ventilador ${action}`);
}

document.getElementById('lights-on').addEventListener('click', () => controlLights('encendidas'));
document.getElementById('lights-off').addEventListener('click', () => controlLights('apagadas'));
document.getElementById('fan-on').addEventListener('click', () => controlFan('encendido'));
document.getElementById('fan-off').addEventListener('click', () => controlFan('apagado'));

const socket = new WebSocket('ws://192.168.1.100:81');
function sendCommand(command) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(command);
        console.log(`Comando enviado: ${command}`);
    } else {
        console.error("Socket no conectado");
    }
}

document.getElementById('brightness').addEventListener('input', (e) => {
    sendCommand(`BRIGHTNESS_${e.target.value}`);
});

document.getElementById('alert-toggle').addEventListener('click', () => sendCommand('ALERT_ON'));

setInterval(() => {
    fetch('/sensor-data')
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('nitrates').innerText = data.nitrates;
            document.getElementById('sulfates').innerText = data.sulfates;
            document.getElementById('ph').innerText = data.ph;
            document.getElementById('metals').innerText = data.metals;
        })
        .catch((error) => console.error("Error obteniendo datos del sensor:", error));
}, 2000);

function initMap() {
    const sensorLocation = { lat: -0.22985, lng: -78.52495 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: sensorLocation
    });

    const marker = new google.maps.Marker({
        position: sensorLocation,
        map: map,
        title: "Sensor del Río Machángara"
    });
}

function updateCameraFeed() {
    const cameraImage = document.getElementById('camera-image');
    cameraImage.src = `http://192.168.1.100/capture?_t=${new Date().getTime()}`;
}

setInterval(updateCameraFeed, 3000);
