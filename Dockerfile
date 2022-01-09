FROM alpine

WORKDIR /app

ENV NODE_ENV production

ADD ./dist/server.js /app/server.js
ADD ./package.json /app/package.json
ADD ./yarn.lock /app/yarn.lock
ADD ./.yarnrc.yml /app/.yarnrc.yml
ADD ./.yarn/plugins /app/.yarn/plugins
ADD ./.yarn/releases /app/.yarn/releases
ADD ./LICENSE /app/LICENSE

RUN apk add --update nodejs yarn && \
    yarn workspaces focus --production && \
    apk del yarn && \
    rm -rf .yarn/ yarn.lock .yarnrc.yml package.json

CMD node server.js
