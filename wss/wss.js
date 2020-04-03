const { aedes } = require('../aedes/aedes');
const ws = require('websocket-stream')
const https = require('https');
const fs = require('fs')
const KEYPATH = "/usr/src/credentials/" + process.env.KEY_NAME;
const CERTPATH = "/usr/src/credentials/" + process.env.CERT_NAME;

const wssPort = 8111
console.log("aedes id", aedes.id)

const options = {
  key: fs.readFileSync(KEYPATH),
  cert: fs.readFileSync(CERTPATH)
}

const httpsServer = https.createServer(options)

ws.createServer({ server: httpsServer }, aedes.handle)

httpsServer.listen(wssPort, function () {
  console.log('websocket secure server listening on port: ', wssPort)
})


