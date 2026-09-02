#include <WiFi.h>
#include <WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ---- Apne phone hotspot ka SSID aur password ----
const char* ssid = "Krishna";
const char* password = "1122334455";

WebServer server(80);

const int trigPin = 14;
const int echoPin = 18;
const int ledPin  = 25;
const int turbidityPin = 34;
#define ONE_WIRE_BUS 12

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

const int onTimeUs = 100;
const int resolutionBits = 12;

long duration;
float distanceCm = 0;

int turbidityRaw = 0;
float turbidityVoltage = 0.0;

float temperatureC = 0.0;

uint32_t currentFreq = 200;
bool manualMode = false;
unsigned long lastManualInput = 0;

void setLedFrequency(uint32_t freqHz) {
  if (freqHz < 200) freqHz = 200;
  if (freqHz > 5000) freqHz = 5000;

  ledcDetach(ledPin);
  ledcAttach(ledPin, freqHz, resolutionBits);

  uint32_t periodUs = 1000000UL / freqHz;
  uint32_t maxDuty = (1 << resolutionBits) - 1;

  if (onTimeUs >= periodUs) {
    ledcWrite(ledPin, maxDuty);
  } else {
    uint32_t duty = (uint32_t)(((uint64_t)onTimeUs * maxDuty) / periodUs);
    ledcWrite(ledPin, duty);
  }
  currentFreq = freqHz;
}

void readTurbidity() {
  turbidityRaw = analogRead(turbidityPin);
  turbidityVoltage = turbidityRaw * (3.3 / 4095.0);
}

void readTemperature() {
  tempSensor.requestTemperatures();
  float t = tempSensor.getTempCByIndex(0);
  if (t != DEVICE_DISCONNECTED_C) {
    temperatureC = t;
  }
}

// ---- Webpage HTML ----
const char htmlPage[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>ESP32 Sensor Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial; text-align: center; background:#111; color:#eee; padding:30px; }
    h2 { color: #0f0; }
    input[type=range] { width: 80%%; height: 30px; }
    .val { font-size: 26px; margin: 15px; color: #0ff; }
    .param { font-size: 20px; margin: 12px; padding: 10px; background:#1c1c1c; border-radius:8px; }
    button { padding: 10px 20px; font-size: 16px; margin-top: 15px; }
  </style>
</head>
<body>
  <h2>ESP32 Sensor Dashboard</h2>

  <div class="val" id="freqVal">-- Hz</div>
  <input type="range" min="200" max="5000" value="200" id="freqSlider" oninput="sendFreq(this.value)">
  <br>
  <button onclick="setAuto()">Auto Mode (Sensor)</button>

  <div class="param" id="distVal">Distance: -- cm</div>
  <div class="param" id="turbVal">Turbidity: -- V (raw: --)</div>
  <div class="param" id="tempVal">Temperature: -- °C</div>

  <script>
    let slider = document.getElementById("freqSlider");
    let freqVal = document.getElementById("freqVal");
    let distVal = document.getElementById("distVal");
    let turbVal = document.getElementById("turbVal");
    let tempVal = document.getElementById("tempVal");

    function sendFreq(val) {
      freqVal.innerText = val + " Hz";
      fetch("/setFreq?value=" + val);
    }

    function setAuto() {
      fetch("/setAuto");
    }

    setInterval(() => {
      fetch("/status").then(r => r.json()).then(data => {
        if (!data.manual) {
          slider.value = data.freq;
          freqVal.innerText = data.freq + " Hz (Auto)";
        }
        distVal.innerText = "Distance: " + data.distance + " cm";
        turbVal.innerText = "Turbidity: " + data.turbVoltage + " V (raw: " + data.turbRaw + ")";
        tempVal.innerText = "Temperature: " + data.temperature + " °C";
      });
    }, 1000);
  </script>
</body>
</html>
)rawliteral";

void handleRoot() {
  server.send_P(200, "text/html", htmlPage);
}

void handleSetFreq() {
  if (server.hasArg("value")) {
    int freq = server.arg("value").toInt();
    manualMode = true;
    lastManualInput = millis();
    setLedFrequency(freq);
  }
  server.send(200, "text/plain", "OK");
}

void handleSetAuto() {
  manualMode = false;
  server.send(200, "text/plain", "OK");
}

void handleStatus() {
  String json = "{";
  json += "\"freq\":" + String(currentFreq);
  json += ",\"manual\":" + String(manualMode ? "true" : "false");
  json += ",\"distance\":" + String(distanceCm, 2);
  json += ",\"turbRaw\":" + String(turbidityRaw);
  json += ",\"turbVoltage\":" + String(turbidityVoltage, 2);
  json += ",\"temperature\":" + String(temperatureC, 2);
  json += "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(turbidityPin, INPUT);

  tempSensor.begin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("WiFi connection FAILED. Check SSID/password.");
  }

  server.on("/", handleRoot);
  server.on("/setFreq", handleSetFreq);
  server.on("/setAuto", handleSetAuto);
  server.on("/status", handleStatus);
  server.begin();
}

void loop() {
  server.handleClient();

  readTurbidity();
  readTemperature();

  if (manualMode && millis() - lastManualInput > 5000) {
    manualMode = false;
  }

  if (!manualMode) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    duration = pulseIn(echoPin, HIGH, 30000);

    if (duration != 0) {
      distanceCm = (duration * 0.0343) / 2;
      float freq = map(constrain(distanceCm, 2, 100), 2, 100, 5000, 200);
      setLedFrequency((uint32_t)freq);
    }
  }

  delay(200);
}
