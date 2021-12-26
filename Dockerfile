FROM alpine

WORKDIR /app

ENV NODE_ENV production

ADD . /app

RUN apk add --update nodejs yarn && \
    yarn install && yarn cache clean

CMD node dist/server.js
