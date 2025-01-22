#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

#define SENSOR_HUMEDAD_ESTE 33
#define SENSOR_HUMEDAD_OESTE 35
#define SENSOR_TEMP 26
#define LED_PIN 15
#define LED_VERDE 34
#define LED_AZUL 22
#define LED_ROJO 32

#define DHTTYPE DHT11
DHT dht(SENSOR_TEMP, DHTTYPE);

const char* ssid = "skaotico honor";
const char* password = "123456789";

const char* serverUrl = "http://192.168.106.109:3000/sector/Sector%20Norte/arboles/Manzano/sensores";

int soilDry = 3800;
int soilWet = 800;

unsigned long lastReadTime = 0;
const unsigned long readInterval = 30000;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_ROJO, OUTPUT);
  pinMode(LED_AZUL, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(LED_VERDE, LOW);
  digitalWrite(LED_ROJO, LOW);
  digitalWrite(LED_AZUL, LOW);
  WiFi.begin(ssid, password);
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (millis() - startTime > 10000) {
      Serial.println("Tiempo de espera agotado. No se pudo conectar.");
      return;
    }
  }
  Serial.println("\n¡Conectado a WiFi!");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());
  dht.begin();
}

void loop() {
  unsigned long currentTime = millis();
  if (currentTime - lastReadTime >= readInterval) {
    lastReadTime = currentTime;
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(LED_AZUL, HIGH);
    int humedityTierraEste = analogRead(SENSOR_HUMEDAD_ESTE);
    int humidityPercentEste = calcularHumedad(humedityTierraEste);
    Serial.print("Lectura analógica este: ");
    Serial.println(humedityTierraEste);
    Serial.print("Humedad en la tierra (este): ");
    Serial.print(humidityPercentEste);
    Serial.println("%");
    int humedityTierraOeste = analogRead(SENSOR_HUMEDAD_OESTE);
    int humidityPercentOeste = calcularHumedad(humedityTierraOeste);
    Serial.print("Lectura analógica oeste: ");
    Serial.println(humedityTierraOeste);
    Serial.print("Humedad en la tierra (oeste): ");
    Serial.print(humidityPercentOeste);
    Serial.println("%");
    float humedad = dht.readHumidity();
    float temperatura = dht.readTemperature();
    if (isnan(humedad) || isnan(temperatura)) {
      Serial.println("Error al leer el sensor DHT.");
    } else {
      Serial.print("Humedad relativa (DHT): ");
      Serial.print(humedad);
      Serial.println("%");
      Serial.print("Temperatura (DHT): ");
      Serial.print(temperatura);
      Serial.println("°C");
    }
    sendPostRequest(humidityPercentEste, humidityPercentOeste);
    delay(3000);
    digitalWrite(LED_AZUL, LOW);
    digitalWrite(LED_PIN, LOW);
  }
  delay(1000);
}

int calcularHumedad(int lecturaAnalogica) {
  int porcentajeHumedad = map(lecturaAnalogica, soilDry, soilWet, 0, 100);
  return constrain(porcentajeHumedad, 0, 100);
}

void sendPostRequest(int humidityEste, int humidityOeste) {
  digitalWrite(LED_VERDE, LOW);
  digitalWrite(LED_ROJO, LOW);
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("accept", "*/*");
    http.addHeader("Content-Type", "application/json");

    // Obtener la fecha actual en formato ISO 8601
    String fecha = getCurrentDate();
    
    // Crear el JSON para el cuerpo de la solicitud
    String jsonData = "[{"
                      "\"nombre_sensor\": \"Este\", "
                      "\"humedad\": " + String(humidityEste) + ", "
                      "\"fecha\": \"" + fecha + "\"}, "
                      "{"
                      "\"nombre_sensor\": \"Oeste\", "
                      "\"humedad\": " + String(humidityOeste) + ", "
                      "\"fecha\": \"" + fecha + "\"}]";

    int httpCode = http.POST(jsonData);
    if (httpCode > 0) {
      digitalWrite(LED_VERDE, HIGH);
      Serial.print("Código de respuesta: ");
      Serial.println(httpCode);
      String payload = http.getString();
      Serial.println("Respuesta del servidor: ");
      Serial.println(payload);
      delay(1000);
      digitalWrite(LED_VERDE, LOW);
    } else {
      digitalWrite(LED_ROJO, HIGH);
      Serial.print("Error en la solicitud. Código de error HTTP: ");
      Serial.println(httpCode);
      Serial.print("Descripción del error: ");
      Serial.println(http.errorToString(httpCode));
      delay(1000);
      digitalWrite(LED_ROJO, LOW);
    }
    http.end();
  } else {
    Serial.println("No conectado a WiFi");
  }
}

String getCurrentDate() {
    // solo a modo de prueba, esto debe ser tomado desde el server o bd
  return "2025-01-22T00:00:00.000Z";
}
