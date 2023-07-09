const StatusCode = {
    Created: 201,
    OK: 200
}

const ResponseMessageCode = {
    Created: 'Created',
    OK: 'Success'
}

class SuccessResponse {
    constructor({ message, status, metadata }) {
        this.status = status
        this.message = message
        this.metadata = metadata
    }

    send(res) {
        return res.status(this.status).send({
            message: this.message,
            metadata: this.metadata
        })
    } 
}

class CreatedResponseSuccess extends SuccessResponse {
    constructor({ message = ResponseMessageCode.Created, status = StatusCode.Created, metadata = {}}) {
        super({ message, status, metadata })
    }
}

class OkResponseMessage extends SuccessResponse {
    constructor({ message = ResponseMessageCode.OK, status = StatusCode.OK, metadata = {}}) {
        super({ message, status, metadata })
    }
}

module.exports = {
    CreatedResponseSuccess,
    OkResponseMessage
}