const createRequest = require('./index').createRequest
const createBtcRequest = require('./index').createBtcRequest
const createEthRequest = require('./index').createEthRequest

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8088

app.use(bodyParser.json())

//merge data ...
app.get('/balance', (req, res) => {
  
  createRequest(req.query, (status, result) => {

    console.log('Result: ', result)
    res.status(status).json(result)

  })
})

app.get('/balance/btc', (req, res) => {
  
  createBtcRequest(req.query.address, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)

  })
})

app.get('/balance/eth', (req, res) => {

  createEthRequest(req.query.address, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)

  })
})













app.listen(port, () => console.log(`Listening on port ${port}!`))
