FROM node:current-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY aedes.js /usr/src/app
VOLUME [ "/usr/src/app" ]