const { Requester, Validator } = require('@chainlink/external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

const createRequest = (input, callback) => {

  console.log(input);

  getBtcBalance(input.btcAddress ,(btcBalance) => {
    console.log('btcBalance: ', btcBalance)

    getEthBalance(input.ethAddress,(ethBalance) =>{
      console.log('ethBalance: ', ethBalance)

      const retReponse = {
          status:200,
          data:[btcBalance,ethBalance]
      }
      callback(200, retReponse)

    });

  })

}

//seperate the api btc
const createBtcRequest = (address, callback) => {
  
  getBtcBalance(address ,(btcBalance) => {
    console.log('btcBalance: ', btcBalance)
    const retReponse = {
        data:btcBalance
    }
    callback(200, retReponse)
  });

}

const createEthRequest = (address, callback) => {
  
  getEthBalance(address ,(ethBalance) => {
    console.log('ethBalance: ', ethBalance)
    const retReponse = {
        data:ethBalance
    }
    callback(200, retReponse)
  });

}

const getBtcBalance = (btcAddress,callback)  => {

  const url = `https://blockchain.info/q/addressbalance/${btcAddress}`

  console.log(url);

  Requester.request(url, customError)
    .then(response => {
      callback(response.data);
    })
    .catch(error => {
      console.log("get btc balance error :");
      console.log(error);
      callback(-1);
    })
}

const getEthBalance = (ethAddress,callback) =>{

  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${ethAddress}&tag=latest&apikey=NF6N7FHJSHMIXZ34XDB4VIBQ8Z6242SW3C`

  Requester.request(url, customError)
    .then(response => {
      const result = Requester.validateResultNumber(response.data,["result"])
      callback(result);
    })
    .catch(error => {
      console.log("get eth balance error :");
      console.log(error);
      callback(0);
    })

}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
//
module.exports.createBtcRequest = createBtcRequest
module.exports.createEthRequest = createEthRequest
