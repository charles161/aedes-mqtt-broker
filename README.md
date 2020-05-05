# Aedes MQTT Broker

This library creates an MQTT Broker on your machine and allows for **tcp** and **wss** connections using Aedes.

## Libraries Used

-   [Aedes]
-   [mqemitter-redis]
-   [aedes-persistence-redis]
-   [websocket-stream]

## Environment Variables

1. REDIS_HOST : This is the name of the redis host. If a docker image is used, this should be **redis**, else other redis hosts can be given.
2. REDIS_PORT: This is the redis port. It defaults to **6379**.
3. WSS_ENABLED: Setting a value of **true** with **KEY_NAME** and **CERT_NAME** env vars defined, enables WSS connections. (TCP connections are On by default)
4. KEY_NAME: This is the your SSL certificate Key name that is used for **wss** connections in Aedes Broker. (The path defaults to /usr/src/credentials volume in the docker container)
5. CERT_NAME: This is the your SSL certificate name that is used for **wss** connections in Aedes Broker. (The path defaults to /usr/src/credentials volume in the docker container)
6. CONCURRENCY: This is the maximum number of concurrent messages delivered. Defaults to **10000**.
7. QUEUE_LIMIT: This is the maximum number of queued messages before client session is established. Defaults to **100**.
8. CONNECTION_TIMEOUT: The maximum waiting time in milliseconds. Defaults to **30000**.
9. AUTH_USERNAME: Enables username authentication if specified. (Standalone without AUTH_PASSWORD)
10. AUTH_PASSWORD: Enables password authentication if specified. (Works along with AUTH_USERNAME)
11. WS_ENABLED: Set **true** to run Websocket server on port 8110.
12. ROOT_PATH: Sets the base path of the WSS credentials. Defaults to **/usr/src/credentials**

-   The path of the credentials defaults to /usr/src/redentials. You can modify the path in the file aedes.js or if using docker you can set the env var ROOT_PATH

## Redis

A redis server either running locally or remotely can be used for this broker. To setup one locally [click].

## Setup locally

-   Clone the repo
-   cd into it
-   Follow the commands

```bash
cd aedes
npm install
REDIS_HOST=<redis-host> REDIS_PORT=<redis-port> node aedes.js # If redis is setup
WS_ENABLED=true node aedes.js # To enable WebSocket Server on Port 8110
WSS_ENABLED=true KEY_NAME=<path-to-key> CERT_NAME=<path-to-cert> node aedes.js # To enable WSS Server on Port 8120
```

-   The server would be open for TCP connections on Port 7070 by default
-   If WSS is enabled via env vars , WSS connections would be open on Port 8120
-   If WS is enabled via env vars, WS connections would be open on Port 8110

## Setup using Docker Image

Find the docker image with documentation [here]

## Sample docker-compose.yml

```yml
version: "2.2"
services:
    redis:
        image: "redis:alpine"
        restart: always
    aedes_broker:
        image: charles161/aedes_mqtt_broker:latest
        restart: always
        environment:
            REDIS_HOST: redis
            AUTH_USERNAME: someuser
            AUTH_PASSWORD: somepassword
            WSS_ENABLED: "true"
            WS_ENABLED: "true"
            KEY_NAME: privkey.pem
            CERT_NAME: fullchain.pem
        ports:
            - "7070:7070" #tcp
            - "8120:8120" #wss
            - "8110:8110" #ws
        volumes:
            - /root/aedesBroker:/usr/src/credentials
        depends_on:
            - redis
```

[mqemitter-redis]: https://www.npmjs.com/mqemitter-redis
[aedes-persistence-redis]: aedes-persistence-redis
[aedes]: https://github.com/moscajs/aedes
[websocket-stream]: https://www.npmjs.com/package/websocket-stream
[here]: https://hub.docker.com/r/charles161/aedes_mqtt_broker
[click]: https://redis.io/topics/quickstart.
