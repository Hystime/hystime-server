FROM alpine

WORKDIR /app

ENV NODE_ENV production

ADD . /app

RUN apk add --update nodejs yarn && \
    yarn workspaces focus --production && yarn cache clean && apk del yarn

CMD node dist/server.js
