FROM alpine

WORKDIR /app

ENV NODE_ENV production

COPY LICENSE .
COPY dist/server.js .
COPY dist/server.js.map .
COPY package.json .
COPY yarn.lock .

RUN apk add --update nodejs yarn && \
    echo "nodeLinker: node-modules" >> .yarnrc.yml && \
    yarn set version berry && \
    yarn plugin import workspace-tools && \
    yarn workspaces focus --production && \
    apk del yarn && \
    rm -rf .yarn/ yarn.lock .yarnrc.yml package.json

CMD node server.js
