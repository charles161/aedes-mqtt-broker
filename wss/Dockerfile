FROM node:current-slim
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/aedes
RUN mkdir -p /usr/src/credentials
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY wss.js /usr/src/app
EXPOSE 8111
CMD [ "node", "wss.js" ]
VOLUME [ "/usr/src/aedes" ]
VOLUME [ "/usr/src/credentials" ]