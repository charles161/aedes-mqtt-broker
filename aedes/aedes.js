const redis = require("mqemitter-redis");
const aedesPersistenceRedis = require("aedes-persistence-redis");
const ws = require("websocket-stream");
const https = require("https");
const http = require("http");
const fs = require("fs");
const KEYPATH = process.env.ROOT_PATH || "/usr/src/credentials/" + process.env.KEY_NAME || "privkey.pem";
const CERTPATH = process.env.ROOT_PATH || "/usr/src/credentials/" + process.env.CERT_NAME || "fullchain.pem";

const wssPort = 8120;
const tcpPort = 7070;
const wsPort = 8110;

function init() {
  let mq, persistence;
  if (process.env.REDIS_HOST) {
    mq = redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT || 6379
    });
    persistence = aedesPersistenceRedis({
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST,
      family: 4,
      packetTTL: function(packet) {
        return 10;
      }
    });
  }

  const aedes = require("aedes")({
    concurrency: process.env.CONCURRENCY || 10000,
    queueLimit: process.env.QUEUE_LIMIT || 100,
    connectTimeout: process.env.CONNECTION_TIMEOUT || 30000,
    authenticate: (client, username, pass, callback) => {
      let password = "";
      if (pass) password = pass.toString();
      function errorCall() {
        console.log("Client Not Authenticated", client.id);
        const error = new Error("Auth error");
        error.returnCode = 4;
        callback(error, null);
      }
      if (process.env.AUTH_USERNAME) {
        if (username === process.env.AUTH_USERNAME && !process.env.AUTH_PASSWORD) {
          console.log("Client Authenticated", client.id);
          callback(null, true);
          return;
        }
        if (process.env.AUTH_PASSWORD) {
          if (username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) {
            console.log("Client Authenticated", client.id);
            callback(null, true);
            return;
          }
          errorCall();
          return;
        }
        errorCall();
        return;
      }
      console.log("Zero Auth", client.id);
      callback(null, true);
    },
    mq: mq || null,
    persistence: persistence || null
  });

  aedes.on("subscribe", function(subscriptions, client) {
    console.log(
      "MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m subscribed to topics: " +
        subscriptions.map(s => s.topic).join(",")
    );
  });

  aedes.on("unsubscribe", function(subscriptions, client) {
    console.log(
      "MQTT client \x1b[32m" + (client ? client.id : client) + "\x1b[0m unsubscribed to topics: " + subscriptions.join(",")
    );
  });

  aedes.on("client", function(client) {
    console.log("Client Connected: \x1b[33m" + (client ? client.id : client) + "\x1b[0m");
  });

  aedes.on("clientDisconnect", function(client) {
    console.log("Client Disconnected: \x1b[31m" + (client ? client.id : client) + "\x1b[0m");
  });

  console.log("aedes id", aedes.id);
  return aedes;
}

function initTcpServer(aedes) {
  if (!aedes.id) {
    console.log("Aedes not initialised");
    return;
  }
  const server = require("net").createServer(aedes.handle);

  server.listen(tcpPort, function() {
    console.log("TCP server started and listening on port", tcpPort);
  });
}

function initWssServer(aedes) {
  if (!aedes.id) {
    console.log("Aedes not initialised");
    return;
  }

  try {
    const options = {
      key: fs.readFileSync(KEYPATH),
      cert: fs.readFileSync(CERTPATH)
    };
    const httpsServer = https.createServer(options);
    ws.createServer({ server: httpsServer }, aedes.handle);
    httpsServer.listen(wssPort, function() {
      console.log("WSS server listening on port: ", wssPort);
    });
  } catch (error) {
    console.log("Couldn't start server; Error: ", error);
    return;
  }
}

function initWsServer(aedes) {
  if (!aedes.id) {
    console.log("Aedes not initialised");
    return;
  }
  try {
    const httpServer = http.createServer();
    ws.createServer({ server: httpServer }, aedes.handle);
    httpServer.listen(wsPort, function() {
      console.log("Websocket server listening on port ", wsPort);
    });
  } catch (error) {
    console.log("Couldn't start server; Error: ", error);
    return;
  }
}

let aedes = init();
initTcpServer(aedes);

if (process.env.WSS_ENABLED == "true") initWssServer(aedes);
if (process.env.WS_ENABLED == "true") initWsServer(aedes);
