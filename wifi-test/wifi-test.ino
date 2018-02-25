#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>

IPAddress localIP(69, 69, 69, 69);
IPAddress gateway(69, 69, 69, 69);
IPAddress subnet(255, 255, 255, 0);
const char* identifyNumber = "gara-1";
const char* id = "1";

ESP8266WebServer server(80);

void handleRoot() {
    server.send(200, "text/html", "<h1>You are connected</h1>");
}

void handleStatus() {
    String response = "{\"identify_number\":\"";
    response += id;
    response += "\",\"status\":\"ok\"}";
    server.sendHeader("Access-Control-Allow-Headers", "*");
    server.send(200, "application/json; charset=utf-8", response);
}

void handleWifis() {
    Serial.println("scan start");
    String wifis = "[";

    // WiFi.scanNetworks will return the number of networks found
    int n = WiFi.scanNetworks();
    yield();
    Serial.println("scan done");
    if (n == 0) {
        Serial.println("no networks found");
    } else {
        Serial.print(n);
        Serial.println(" networks found");
        for (int i = 0; i < n; ++i) {
            // Print SSID and RSSI for each network found
            Serial.print(i + 1);
            Serial.print(": ");
            Serial.print(WiFi.SSID(i));
            Serial.print(" (");
            Serial.print(WiFi.RSSI(i));
            Serial.print(")");
            Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE)?" ":"*");
            delay(10);
            wifis += "{\"name\":\"";
            wifis += WiFi.SSID(i);
            wifis += "\",\"quality\":\"";
            wifis += WiFi.RSSI(i);
            wifis += "\"}";
            if (i != n - 1) {
                wifis += ",";
            }
        }
    }
    wifis += "]";
    Serial.println(wifis);
    server.sendHeader("Access-Control-Allow-Headers", "*");
    server.send(200, "application/json; charset=utf-8", wifis);
}

void handleConnectTo() {
    Serial.println(server.args());

    if (server.hasArg("ssid") == true && server.hasArg("pass") == true && server.hasArg("user_id") == true){
        server.sendHeader("Access-Control-Allow-Headers", "*");
        server.send(200, "application/json; charset=utf-8", "{\"status\":\"ok\"}");
        yield();

        Serial.println();
        Serial.println("Config wifi------------------");
        Serial.print("Wifi name:");
        Serial.println(server.arg("ssid"));
        Serial.print("Wifi password:");
        Serial.println(server.arg("pass"));
        Serial.print("User id:");
        Serial.println(server.arg("user_id"));
        Serial.println("-----------------------------");
    } else {
        server.send(200, "application/json; charset=utf-8", "{\"status\":\"error\"}");
        return;
    }
}

void handleOk() {
    server.sendHeader("Access-Control-Allow-Headers", "*");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    // server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json; charset=utf-8", "{\"status\":\"ok\"}");
}

void setup() {
    Serial.begin(115200);
    Serial.println();

    Serial.print("Configuring access point...");
    WiFi.softAPConfig(localIP, gateway, subnet);
    WiFi.softAP(identifyNumber);

    IPAddress myIP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.println(myIP);
    server.on("/", HTTP_GET, handleRoot);
    server.on("/status", HTTP_GET, handleStatus);
    server.on("/wifis", HTTP_GET, handleWifis);
    server.on("/connect-to", HTTP_POST, handleConnectTo);
    server.on("/", HTTP_OPTIONS, handleOk);
    server.on("/status", HTTP_OPTIONS, handleOk);
    server.on("/wifis", HTTP_OPTIONS, handleOk);
    server.on("/connect-to", HTTP_OPTIONS, handleOk);
    server.begin();
    Serial.println("HTTP server started");
}

void loop() {
    server.handleClient();
}


















