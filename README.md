##TODO

1. swich to sockjs
2. drag and drop files to add
3. drag and drop to desktop
4. multiplex file transfers
5. chat
6. security

##INSTALL

1. clone the repo
2. npm install
3. to start in DEV: node app.js
4. to start in PROD: npm start

## FLOW


Master          Server       Slave
  |  ready(file)  |            |
  |-------------->|  ready     |
  |               |<-----------|
  |               |            |
  |               | start(file)|
  |               |----------->|
  |  getChunk     |   getChunk |
  |<--------------|<-----------|
  | sendChunk     | sendChunk  |
  |-------------->|----------->|
  .               .            .
  .               .            .
  .               .            .
  |    done       |    done    |
  |<--------------|<-----------|