const { aedes } = require('../aedes/aedes');
const tcpPort = 7111

console.log("aedes id", aedes.id)

const server = require('net').createServer(aedes.handle)

server.listen(tcpPort, function () {
 console.log('tcp server started and listening on ', tcpPort)
})


