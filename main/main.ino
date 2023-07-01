#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include "Adafruit_TCS34725.h"

#define anInput A0 // analog feed from MQ135
#define mq135 D3
#define co2Zero 55 // calibrated CO2 0 level
#define DHT_PIN D8
#define DHT_TYPE DHT11
const char *deviceID = "MDV0023";
DHT dht(DHT_PIN, DHT_TYPE);
const char *ssid = "HuskyOP_2.4G";
const char *password = "pitbull96";

const char *serverName = "http://172.1.0.100:4500/api/log";
WiFiClient client;
Adafruit_TCS34725 tcs = Adafruit_TCS34725();

void connectToWiFi()
{
  // Connect to WiFi Network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to WiFi");
  Serial.println("...");
  WiFi.begin(ssid, password);
  int retries = 0;
  while ((WiFi.status() != WL_CONNECTED) && (retries < 15))
  {
    retries++;
    delay(500);
    Serial.print(".");
  }
  if (retries > 14)
  {
    Serial.println(F("WiFi connection FAILED"));
  }
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println(F("WiFi connected!"));
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
  }
  Serial.println(F("Setup ready"));
}

void setup()
{

  Serial.begin(74880);
  delay(2000);
  Serial.println("Starting....");

  connectToWiFi();
  delay(1000);
  dht.begin();
  if (tcs.begin())
  {
    Serial.println("Found sensor");
  }
  else
  {
    Serial.println("No TCS34725 found ... check your connections");
    while (1)
      ;
  }
}

unsigned long lastTime = 0;

unsigned long timerDelay = 10000;

void loop()
{
  delay(2000);
  if ((millis() - lastTime) > timerDelay)
  {
    // Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED)
    {
      WiFiClient client;
      HTTPClient http;

      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      http.addHeader("Content-Type", "application/json");
      Serial.println("{\"co2\":\"" + String(getCO2()) + "\",\"heartRate\":\""
                                                                          "90"
                                                                          "\",\"dht\":\"" +
                                       String(getTemp()) + "\",\"deviceID\":\"" + deviceID + "\",\"color\":" + String(getColor()) + "}");
      int httpResponseCode = http.POST("{\"co2\":\"" + String(getCO2()) + "\",\"heartRate\":\""
                                                                          "90"
                                                                          "\",\"dht\":" +
                                       String(getTemp()) + ",\"deviceID\":\"" + deviceID + "\",\"color\":" + String(getColor()) + "}");

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      http.end();
    }
    else
    {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
String getColor()
{
  uint16_t r, g, b, c, colorTemp, lux;

  tcs.getRawData(&r, &g, &b, &c);
  colorTemp = tcs.calculateColorTemperature(r, g, b);
  lux = tcs.calculateLux(r, g, b);

  return "{\"red\":\"" + String(r) + "\",\"green\":\"" + String(g) + "\",\"blue\":\"" + String(b) + "\"}";
}
String getTemp()
{
  float h = dht.readHumidity();

  float t = dht.readTemperature();

  return "{\"temperature\":\"" + String(t) + "\",\"humidity\":\"" + String(h) + "\"}";

}
int getCO2()
{
  int co2now[10]; // int array for co2 readings
  int co2raw = 0; // int for raw value of co2
  int co2ppm = 0; // int for calculated ppm
  int co2comp = 0;
  int zzz = 0; // int for averaging
  int grafX = 0;

  for (int x = 0; x < 10; x++) // samplpe co2 10x over 2 seconds
  {
    co2now[x] = analogRead(A0);
    delay(20);
  }

  for (int x = 0; x < 10; x++) // add samples together
  {
    zzz = zzz + co2now[x];
  }

  co2raw = zzz / 10;         // divide samples by 10
  co2ppm = co2raw - co2Zero; // get calculated ppm

  return co2ppm;
}
