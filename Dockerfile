FROM alpine

WORKDIR /app

ENV NODE_ENV production

ADD . /app

RUN apk add --update nodejs yarn && \
    yarn install --production --frozen-lockfile && yarn cache clean && apk del yarn

CMD node dist/server.js
