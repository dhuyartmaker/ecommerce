const apiKeyModel = require('../models/apikey.model')

const findById = async (key) => {
    return await apiKeyModel.findOne({ key }).lean();
}

module.exports = {
    findById
}