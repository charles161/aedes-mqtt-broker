const KEYPATH = "/etc/letsencrypt/live/charlescool.xyz/privkey.pem";
const CERTPATH = "/etc/letsencrypt/live/charlescool.xyz/fullchain.pem";

const fs = require('fs')
const aedes = require('aedes')()
const ws = require('websocket-stream')
const https = require('https');
const tcpPort = 7070
const wssPort = 8120

const options = {
 key: fs.readFileSync(KEYPATH),
 cert: fs.readFileSync(CERTPATH)
}

// tcp server
const server = require('net').createServer(aedes.handle)

server.listen(tcpPort, function () {
 console.log('server started and listening on tcpPort ', tcpPort)
})

//wss server
const httpsServer = https.createServer(options)

ws.createServer({ server: httpsServer }, aedes.handle)

httpsServer.listen(wssPort, function () {
 console.log('websocket secure server listening on port: ', wssPort)
})

aedes.on('subscribe', function (subscriptions, client) {
 console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
  '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
})

aedes.on('unsubscribe', function (subscriptions, client) {
 console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
  '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
})

aedes.on('client', function (client) {
 console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
 console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

// aedes.on('publish', async function (packet, client) {
//  console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
// })


