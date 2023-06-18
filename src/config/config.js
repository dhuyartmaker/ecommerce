const overwriteDevConfig = require('./dev.config.json');
const overwriteDefaultConfig = require('./config.json');

const configDefault = {
}
const env = process.env.NODE_ENV || "pro";
console.log("===env===", env);

module.exports = {
    config: {
        ...configDefault,
        ...(env === "dev" ? overwriteDevConfig : overwriteDefaultConfig),
    }
}