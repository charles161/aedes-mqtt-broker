const KEYPATH = "/etc/letsencrypt/live/charlescool.xyz/privkey.pem";
const CERTPATH = "/etc/letsencrypt/live/charlescool.xyz/fullchain.pem";

const fs = require('fs')
const aedes = require('aedes')()
const ws = require('websocket-stream')
const https = require('https');
const sslPort = 8883
const tcpPort = 8881
const wssPort = 8882

const options = {
 key: fs.readFileSync(KEYPATH),
 cert: fs.readFileSync(CERTPATH)
}

const httpsServer = https.createServer(options)

// const server = require('tls').createServer(options, aedes.handle)

ws.createServer({ server: httpsServer }, aedes.handle)

// server.listen(sslPort, function () {
//  console.log('server started and listening on sslPort ', sslPort)
// })
httpsServer.listen(wssPort, function () {
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

 aedes.on('publish', async function (packet, client) {
  console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
 })

 console.log('websocket server listening on port ', wssPort)
})


