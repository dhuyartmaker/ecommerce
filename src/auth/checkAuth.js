const { findById } = require("../services/apiKey.service")

const HEADER = {
    API_KEY: 'x-api-key'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Unauthorization'
            })
        }
        const objkey = await findById(key)
        if (!objkey) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
        req.objKey = objkey;
        next()
    } catch (error) {
        return res.status(403).json({
            message: 'Unauthorization'
        })
    }
}

const permission = (permission) => async (req, res, next) => {
    const checkPermission = req.objKey.permission.includes[permission]
    if (checkPermission) { 
        return next()
    }
    return res.status(403).json({
        message: 'Forbidden'
    })
}

module.exports = {
    apiKey,
    permission
}