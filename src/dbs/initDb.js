const mongoose = require('mongoose');
const { checkConnection } = require('../helpers/check-connect');
const {config} = require('../config/config');

const connectString = config.db;

class Database {
    constructor() {
        this.connect()
    }

    connect() {
        if ("dev") {
            mongoose.set("debug", true)
            mongoose.set("debug", { color: true })
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(res => {
            console.log("Connect Success!!")
            checkConnection();
        })
            .catch(error => console.log("Connect error: ", error));
    }

    static getInstance() {
        if (!this.instance) {
            Database.instance = new Database()
        }
        return this.instance;
    }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb;