FROM node:current-slim
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/aedes
WORKDIR /usr/src/app
COPY tcp.js /usr/src/app
EXPOSE 7111
CMD [ "node", "tcp.js" ]
VOLUME [ "/usr/src/aedes" ]