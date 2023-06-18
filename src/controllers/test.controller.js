const refTestModel = require("../models/refTest.model");
const testModel = require("../models/test.model");

class TestController {
    signUp = async (req, res, next) => {
        try {
            const { name, text, text2 } = req.body;
            const holdTest = await testModel.create({ name, text , text2 })
            const refTestHold = await refTestModel.create({ textId: holdTest._id })
            return res.status(200).json({
                message: "Ok",
                metadata: holdTest
            })
        } catch (error) {
            return res.status(500).json({
                message: error
            })
        }
    }
}

module.exports =  new TestController();