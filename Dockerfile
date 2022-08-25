FROM node:16.3.0-alpine

RUN apk add --no-cache bash

USER node

WORKDIR /home/node/app