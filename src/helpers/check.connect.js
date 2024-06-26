"use strict";

const os = require("os");
const process = require("process");
const mongoose = require("mongoose");
const _SECONDS = 5000;
// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection:: ${numConnection}`);
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage.rss;
    // Example maximum 5 connections based on number of core
    const maxConnections = numCore * 5;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage() / 1024 / 1024} MB`);
    if (numConnection > maxConnections) {
      console.log("Connection over load detected!");
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverLoad,
};
