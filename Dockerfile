FROM alpine

WORKDIR /app

ENV NODE_ENV production

ADD ./dist/server.js /app/server.js
ADD ./package.json /app/package.json
ADD ./LICENSE /app/LICENSE

RUN apk add --update nodejs yarn && \
    yarn workspaces focus --production && yarn cache clean && apk del yarn

CMD node server.js
