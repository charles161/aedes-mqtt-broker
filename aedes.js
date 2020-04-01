const KEYPATH = "/etc/letsencrypt/live/charlescool.xyz/privkey.pem";
const CERTPATH = "/etc/letsencrypt/live/charlescool.xyz/fullchain.pem";

const fs = require('fs')
const aedes = require('aedes')()
const sslPort = 8883
const tcpPort = 8882

const options = {
 key: fs.readFileSync(KEYPATH),
 cert: fs.readFileSync(CERTPATH)
}

const server = require('tls').createServer(options, aedes.handle)

server.listen(sslPort, function () {
 console.log('server started and listening on sslPort ', sslPort)
})

const tcpserver = require('net').createServer(aedes.handle)

tcpserver.listen(tcpPort, function () {
 console.log('server started and listening on tcpPort ', tcpPort)
})