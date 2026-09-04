# AUV SONAR Technical Workflow and Demonstration Guide

## 1. Project purpose

AUV SONAR is intended to be a low-power, real-time adaptive software-defined sonar transmitter payload. The system should sense the water column, select suitable transmission parameters, synthesize a waveform, and transmit it through an analog output.

The current prototype demonstrates the environmental telemetry and Wi-Fi webpage path. It does not yet implement the final DAC/DMA acoustic transmitter engine.

## 2. Current end-to-end data flow

```text
Sensors
  |
  v
ESP32 ADC / GPIO / I2C interfaces
  |
  v
ESP32 firmware reads values
  |
  v
ESP32 WebServer: GET /status
  |
  |  JSON over Wi-Fi, HTTP port 80
  v
Browser fetches http://ESP32_IP/status once per second
  |
  v
React Telemetry page parses JSON
  |
  v
Sensor cards show the latest readings
```

The computer and ESP32 must be connected to the same Wi-Fi network. The browser connects directly to the ESP32 IP address; there is no cloud service or database involved in this telemetry path.

## 3. Sensors and current connections

| Measurement | Current sensor/interface | Firmware connection |
| --- | --- | --- |
| Distance | Ultrasonic trigger/echo sensor | Trigger GPIO 14, echo GPIO 18 |
| Turbidity | Analog turbidity sensor | ADC GPIO 34 |
| Temperature | DS18B20 OneWire sensor | GPIO 12 |
| Humidity | BME680 | I2C, normally SDA GPIO 21 and SCL GPIO 22 |
| BME temperature | BME680 | I2C, address `0x76` or `0x77` |
| Pressure | BME680 | I2C |
| Gas resistance | BME680 | I2C |
| Salinity | Not connected in current firmware | Not available; UI value is demo-only |
| Current output | LED PWM test output | GPIO 25 |

Important: the BME680 is an air-quality/environment sensor. It is not a waterproof underwater sensor. For submerged operation it must be isolated correctly, or replaced with marine-rated pressure, temperature, conductivity/salinity, and turbidity sensors.

## 4. Hardware and software requirements

### Hardware

- ESP32 development board
- USB data cable
- Computer with Wi-Fi
- Wi-Fi router or phone hotspot on the same network
- Ultrasonic distance sensor
- Analog turbidity sensor
- DS18B20 temperature sensor with suitable pull-up resistor
- BME680 breakout board
- 3.3 V-compatible wiring and common ground

Do not connect a 5 V sensor output directly to an ESP32 ADC pin. GPIO 34 is input-only and must receive a voltage within the ESP32 ADC safe range.

### Arduino IDE

Install:

- ESP32 board support by Espressif
- `OneWire`
- `DallasTemperature`
- `Adafruit BME680 Library`
- `Adafruit Unified Sensor`

Select the correct ESP32 board and COM port. Use a USB data cable, not a charge-only cable.

### Web project

From the project directory:

```bash
pnpm install
pnpm dev
```

The full application normally runs at `http://localhost:3000/`. The telemetry page is `/telemetry`.

## 5. Upload the ESP32 firmware

1. Open `server/SRV_VITALITY.ino` in Arduino IDE.
2. Change the Wi-Fi credentials in the firmware before uploading:

   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```

3. Connect the ESP32 by USB.
4. Select the ESP32 board and its COM port.
5. Compile and upload the sketch.
6. Open Serial Monitor at `115200` baud.
7. Wait for the message:

   ```text
   ESP32 IP Address: 192.168.x.x
   ```

8. If the BME680 is not detected, the firmware prints a warning and sends `null` for the BME fields.

Never publish real Wi-Fi credentials in a repository or presentation. Move credentials into a local, ignored configuration file before deployment.

## 6. Connect the webpage to the ESP32

Create a local `.env` file in the project root from `.env.example`:

```env
VITE_ESP32_STATUS_URL=http://192.168.1.42/status
```

Replace `192.168.1.42` with the IP printed by the ESP32. Then restart the web server because Vite reads environment variables when it starts:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000/telemetry
```

The telemetry page polls the URL every 1000 milliseconds. The status badge changes to `ESP32 connected` after a successful response. If the request fails, it shows `ESP32 offline`. If no URL is configured, the page uses representative demo values.

## 7. The Wi-Fi message format

The ESP32 serves one JSON object at:

```text
GET http://ESP32_IP/status
```

Example response:

```json
{
  "freq": 200,
  "manual": false,
  "distance": 184.0,
  "turbRaw": 1488,
  "turbVoltage": 1.2,
  "temperature": 18.6,
  "humidity": 62.4,
  "bmeTemperature": 18.8,
  "pressure": 1012.6,
  "gasResistance": 84.2
}
```

Field meanings:

- `distance`: measured distance in centimetres
- `turbRaw`: uncalibrated ADC count from 0 to 4095
- `turbVoltage`: calculated turbidity sensor voltage
- `temperature`: DS18B20 temperature in degrees Celsius
- `humidity`: BME680 relative humidity in percent
- `bmeTemperature`: BME680 temperature in degrees Celsius
- `pressure`: BME680 pressure in hPa
- `gasResistance`: BME680 gas resistance in kOhm
- `freq`: current test PWM frequency in Hz
- `manual`: whether the test frequency is in manual mode

The firmware adds `Access-Control-Allow-Origin: *` to `/status`, which allows a webpage served from `localhost` to read the ESP32 response. This is suitable for a local prototype; production deployments should restrict allowed origins and add authentication.

## 8. Troubleshooting

### ESP32 does not receive an IP address

- Confirm the SSID and password.
- Confirm the network is 2.4 GHz if the board does not support the selected 5 GHz network.
- Ensure the hotspot/router is active.
- Read the Serial Monitor at 115200 baud.
- Confirm the computer is connected to the same network.

### Browser says ESP32 is offline

- First open `http://ESP32_IP/status` directly in the browser.
- Confirm the IP address has not changed after reboot.
- Check Windows Firewall and router client isolation.
- Confirm `.env` has the exact URL, including `/status`.
- Restart Vite after editing `.env`.
- Check that CORS is present in the firmware response.

### BME fields are null or unavailable

- Check SDA/SCL wiring and common ground.
- Try the BME680 address `0x76` or `0x77`.
- Install the Adafruit BME680 and Unified Sensor libraries.
- Confirm the module is actually BME680-compatible.
- Do not treat an enclosed or submerged BME680 as a valid marine measurement without a suitable waterproof design.

### Turbidity value is only shown in volts

The current firmware reports raw ADC count and voltage. Converting voltage to NTU requires calibration with known turbidity samples and a sensor-specific calibration curve. Until that calibration exists, the value must be described as turbidity voltage, not an accurate NTU measurement.

## 9. What is implemented versus planned

### Implemented now

- ESP32 joins Wi-Fi in station mode.
- ESP32 exposes HTTP endpoints on port 80.
- `/status` returns sensor data as JSON.
- Browser-to-ESP32 CORS is enabled for the prototype.
- React polls the ESP32 and updates telemetry cards.
- Demo fallback works when hardware is unavailable.
- Manual test-frequency endpoint exists at `/setFreq?value=...`.
- Sensor-based test-frequency mode exists at `/setAuto`.

### Not yet implemented

- Actual DAC audio output
- LFM chirp synthesis
- Geometric sweep synthesis
- Phase-coded pulse synthesis
- DMA-driven waveform transfer
- Hardware-timer-triggered DAC sampling
- Pulse-duration and amplitude controls
- Salinity sensor input
- Analog amplifier and output filter
- Digital Hamming, Hann, or Blackman windowing
- FFT/spectrum validation
- Browser controls that send waveform configuration back to the ESP32
- Waterproof AUV payload enclosure and electrical isolation

The current `ledc` output is a PWM test signal on GPIO 25. It should not be presented as a finished acoustic sonar transmitter or as a DAC waveform output.

## 10. Intended final technical workflow

The final system should work as follows:

1. Sensors measure depth, turbidity, temperature, salinity, and other environmental parameters.
2. The ESP32 or selected MCU filters and validates the sensor values.
3. Adaptation logic selects centre frequency, bandwidth, pulse duration, amplitude, and waveform family.
4. Firmware generates an LFM chirp, geometric sweep, or phase-coded pulse in a sample buffer.
5. A hardware timer triggers the sample rate.
6. DMA transfers the buffer to a DAC or I2S audio peripheral without blocking the CPU.
7. A digital window reduces edge discontinuities and sidelobes.
8. The analog low-pass filter and amplifier condition the signal.
9. The output is connected to an oscilloscope or spectrum analyzer.
10. FFT and spectrogram measurements verify frequency sweep, bandwidth, distortion, and sidelobes.
11. Telemetry and operating state are sent to the webpage over Wi-Fi for monitoring.

## 11. Cross-question answers

**How does the ESP32 communicate with the webpage?**

Through HTTP over Wi-Fi. The ESP32 runs a small web server. The browser sends `GET /status`, receives JSON, and updates the React state and sensor cards.

**Why must both devices use the same Wi-Fi?**

The browser must be able to route to the ESP32's private local IP address. Same-network operation is the simplest local prototype arrangement and avoids exposing the device to the public internet.

**Is this Bluetooth or cloud communication?**

No. The current telemetry link is direct local Wi-Fi using HTTP. No cloud broker is required.

**Why use JSON?**

JSON is human-readable, easy to inspect in a browser, supported by ESP32 web libraries, and directly parseable with the browser's `response.json()` method. A binary protocol could be used later for higher-rate waveform or telemetry data.

**What happens when Wi-Fi disconnects?**

The webpage marks the device offline. The ESP32 continues its local loop, but new browser data cannot arrive until the network is restored. The page can continue showing the last packet or demo fallback.

**Does the current code generate sonar?**

Not yet. It demonstrates sensor acquisition, Wi-Fi telemetry, and a PWM frequency test. The required DAC/DMA waveform engine and analog transmitter chain are future implementation work.

**Why are there two temperatures?**

The DS18B20 reports `temperature`; the BME680 reports `bmeTemperature`. They are separate physical sensor readings and may differ slightly because they are located in different places and have different response characteristics.

**Can BME680 humidity and gas resistance be used underwater?**

Not directly. The BME680 is intended for air exposure. A real underwater payload needs appropriate waterproof marine sensors and a validated calibration method.

**How will adaptation happen in the final version?**

The firmware will convert validated environmental readings into transmission parameters. For example, higher turbidity or attenuation can select a lower frequency band, while clearer water can permit a higher band for better resolution. Limits must be calibrated experimentally for the transducer, depth, temperature, salinity, and target.

**How will the output be proven?**

Connect the conditioned analog output to an oscilloscope and spectrum analyzer. Verify the time-domain pulse, frequency sweep, bandwidth, amplitude, distortion, and FFT/spectrogram response against the commanded waveform.

## 12. Demonstration script

1. Show the sensor wiring and explain each measurement.
2. Upload the firmware and open Serial Monitor.
3. Point out the ESP32 IP address.
4. Start the web project and open `/telemetry`.
5. Set `VITE_ESP32_STATUS_URL` to the ESP32 `/status` endpoint.
6. Show the connected status badge.
7. Change a sensor condition or move the distance target.
8. Refresh or wait for the next one-second polling cycle.
9. Show the updated card values and explain the JSON packet.
10. Be explicit that the current output is a PWM test signal and that DAC/DMA waveform synthesis is the next hardware milestone.
