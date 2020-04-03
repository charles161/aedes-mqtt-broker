const redis = require('mqemitter-redis')

const mq = redis({
  host: process.env.REDIS_HOST
})
const aedes = require('aedes')(
  {
    concurrency: 100000,
    queueLimit: 5000,
    connectTimeout: 30000,
    mq: mq
  }
)

aedes.on('subscribe', function (subscriptions, client) {
  console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
    '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'))
})

aedes.on('unsubscribe', function (subscriptions, client) {
  console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
    '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'))
})

aedes.on('client', function (client) {
  console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m')
})

// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
  console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m')
})


module.exports = {
  aedes
}