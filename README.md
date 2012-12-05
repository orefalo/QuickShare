

![image](https://raw.github.com/orefalo/QuickShare/master/QuickShare.jpg)

A complete rewrite a [DirtyShare](https://github.com/Miserlou/DirtyShare) featuring:

* Node 8.x
* Express 3.x
* Whiskers templates
* Less CSS
* BinaryJS for cleaner websocket transfers
* Connect-Asset to dynamically uglify/compress resources in production
* A slick User Interface
* Production deployment ready

##Motivation

1. Learning the **node.js** eco-system
2. Have an fast way to share large file between two peers

##What does it do?

It streams files between two peers using a node.js process as the middle man. The application is heavily dependent upon the latest HTML5 standards: websockets, fileapi, advances css styling and animations.


##Installation

1. Clone the repo, cd to folder
2. Install dependencies: npm install
3. to start in DEV: node app.js
4. to start in PROD: npm start

##Flow

```
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
```

##Limitations

* Only works with Chrome for now
* Since this is dealing with WebSockets, you can't hide it behind a typical web-proxy. Consider HA-Proxy, kernel port forwarding or direct exposition.

##Todo

* Detect unsupported browsers
* Rework the about page


##Author

Node.js rocks!  [Olivier Refalo](http://resume.github.com/?orefalo)

