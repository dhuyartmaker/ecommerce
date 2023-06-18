'use-strict'

const mongoose = require('mongoose');
const os = require('os');

const checkConnection = () => {
    const count = mongoose.connections.length;
    console.log("Connections length: ", count)
    return count;
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        console.log("Memory Usage:", memoryUsage / 1024 / 1025, "MB");
        // console.log("Num cores: ", numCore); // 8
        const maxConnect = numCore * 5;

        if (numConnection > maxConnect) {
            console.error("Overload DB;")
        }
    }, 20000)
}

module.exports = {
    checkConnection,
    checkOverload,
}