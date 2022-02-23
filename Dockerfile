FROM alpine

WORKDIR /app

ENV NODE_ENV production

COPY LICENSE .
COPY dist/server.js .
COPY dist/server.js.map .
COPY dist/server.js.LICENSE.txt .

RUN apk add --update nodejs

CMD node server.js
