FROM alpine

WORKDIR /app

ENV NODE_ENV production

COPY .yarnrc.yml .
COPY .yarn .yarn/
COPY LICENSE .
COPY dist/server.js .
COPY package.json .
COPY yarn.lock .

RUN apk add --update nodejs yarn && \
    yarn workspaces focus --production && \
    apk del yarn && \
    rm -rf .yarn/ yarn.lock .yarnrc.yml package.json

CMD node server.js
