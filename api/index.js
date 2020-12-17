const { Requester, Validator } = require('@chainlink/external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  base: ['base', 'from', 'coin'],
  quote: ['quote', 'to', 'market'],
}

// const createRequest = (input, callback) => {

//   console.log("come into ...");
//   console.log(input.btcAddress);

//   // The Validator helps you validate the Chainlink request data
//   //const validator = new Validator(callback, input, customParams)
//   //const jobRunID = validator.validated.id
  
//   //xxl TODO
//   //const endpoint = validator.validated.data.endpoint || 'price'
//   //const btcAddress = "1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj"
//   const btcAddress = input.btcAddress
//   const url = `https://blockchain.info/q/addressbalance/${btcAddress}`

//   // const fsym = validator.validated.data.base.toUpperCase()
//   // const tsyms = validator.validated.data.quote.toUpperCase()

//   const params = {
//     // fsym,
//     // tsyms
//   }

//   // This is where you would add method and headers
//   // you can add method like GET or POST and add it to the config
//   // The default is GET requests
//   // method = 'get' 
//   // headers = 'headers.....'
//   const config = {
//     url,
//     params
//   }

//   const jobRunID = 0;
//   // The Requester allows API calls be retry in case of timeout
//   // or connection failure
//   Requester.request(config, customError)
//     .then(response => {
//       // It's common practice to store the desired value at the top-level
//       // result key. This allows different adapters to be compatible with
//       // one another.

//       console.log("ok");
//       console.log(response.data);
//       console.log(response.status);
      
//       //xxl TODO add Validate ...
//       //response.data.result = Requester.validateResultNumber(response,["data"])
//       const retReponse = {
//           btc:response.data,
//           status:response.status
//       }

//       //response.data.result = response.data;
//       //callback(response.status, Requester.success(jobRunID, retReponse))
//       callback(response.status, retReponse)

//       //
//     })
//     .catch(error => {
      
//       console.log("error");
//       console.log(error);

//       callback(500, Requester.errored(jobRunID, error))
//     })



//     ///
//     //https://api.etherscan.io/api?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest&apikey=NF6N7FHJSHMIXZ34XDB4VIBQ8Z6242SW3C
//     const ethAddress = input.ethAddress
//     url = `https://blockchain.info/q/addressbalance/${btcAddress}`
  
// }


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

const getBtcBalance = (btcAddress,callback)  => {

  const url = `https://blockchain.info/q/addressbalance/${btcAddress}`

  Requester.request(url, customError)
    .then(response => {
      callback(response.data);
    })
    .catch(error => {
      console.log("get btc balance error :");
      console.log(error);
      callback(0);
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
