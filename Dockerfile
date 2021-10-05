FROM node:14-alpine

RUN apk add --no-cache bash
WORKDIR /app