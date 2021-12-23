FROM alpine

WORKDIR /app

RUN apk add --update nodejs

ADD dist/server.js /app/server.js
ADD dist/server.js.LICENSE.txt /app/server.js.LICENSE.txt

CMD node server.js
