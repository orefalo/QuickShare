##TODO

1. security

##INSTALL

1. clone the repo
2. npm install
3. to start in DEV: node app.js
4. to start in PROD: npm start

## FLOW

Master          Server       Slave
  |  join(hash)  |            |
  |------------->|  get/hash  |
  |              |<-----------|
  |   start      |            |
  |<-------------|            |
  |              |            |
  | sendChunk    | fileChunk  |
  |------------->|----------->|
  | progress upd |            |
  |<-------------|            |
  |              |            |

# PROD DEPLOYMENT

