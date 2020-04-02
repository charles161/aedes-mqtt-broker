FROM node:current-slim
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/credentials
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 7070 8120
CMD [ "node", "aedes.js" ]
VOLUME [ "/usr/src/credentials" ]