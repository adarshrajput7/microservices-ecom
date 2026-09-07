const express = require('express')
const { connect } = require("./broker/broker.js")
const setListeners = require('./broker/listners.js')

const app = express()

connect().then(() => {
    setListeners()
})

app.get("/", (req, res) => {
    res.send("Notification service is up and running")
})




module.exports = app