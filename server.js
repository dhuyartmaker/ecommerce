const app = require("./src/app");

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Ok'
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("App listen on port", port)
})