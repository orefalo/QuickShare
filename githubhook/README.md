1. gen a uuid with bash `uuidgen` command
2. define the uuid in app.js
3. defien port in app.js
4. setup github hooks as URL https://myserver.domain:port/uuid
5. generate ssl certificate by calling `gen_ssl_cert`
6. `npm install`
7. as root. cp init.d/githubhook /etc/init.d (you may want to edit a few settings in the file first)
8. as root - service githubhook start


