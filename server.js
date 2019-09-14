/**
 * Filename: server.js
 * Author: Kevin Coetzee
 * 
 *      This file executes the Node server
 *      that allows processing of the Trie data structure
 */
"use strict";

const http = require("http");
const app = require('./app');
const port = process.env.PORT || 3000;


const server = http.createServer(app);
console.log("trie server running on port 3000.");

server.listen(port);