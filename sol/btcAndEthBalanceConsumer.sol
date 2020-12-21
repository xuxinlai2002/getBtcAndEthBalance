pragma solidity 0.4.24;

//ethereum 
//import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/ChainlinkClient.sol";
//ela
import "https://github.com/elastos/Elastos.ELA.SideChain.ETH.Chainlink/evm-contracts/src/v0.4/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/vendor/Ownable.sol";


contract btcAndEthBalanceConsumer is ChainlinkClient, Ownable {

  uint256 constant private ORACLE_PAYMENT = 1 * LINK;
  uint256 public btcBalance;
  uint256 public ethBalance;
  

  event RequestBtcBalanceFulfilled(
    bytes32 indexed requestId,
    uint256 indexed btcBalance
  );

  event RequestEthBalanceFulfilled(
    bytes32 indexed requestId,
    uint256 indexed ethBalance
  );

  
  constructor() public Ownable() {
    setPublicChainlinkToken();
  }

  function RequestBtcAndEthBalance(address _oracle, string _jobId,string _btcAddress,string _ethAddress)
    public
    onlyOwner
  {
    //btc
    Chainlink.Request memory reqBtc = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillBtcBalance.selector);
    reqBtc.add("get", strConcat("http://47.52.148.190:8088/balance/btc/?address=" ,_btcAddress));
    reqBtc.add("path", "data");
    reqBtc.addInt("times",1);
    sendChainlinkRequestTo(_oracle, reqBtc, ORACLE_PAYMENT);

    //eth
    Chainlink.Request memory reqEth = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillEthBalance.selector);
    reqEth.add("get", strConcat("http://47.52.148.190:8088/balance/eth/?address=" ,_ethAddress));
    reqEth.add("path", "data");
    reqEth.addInt("times",1);
    sendChainlinkRequestTo(_oracle, reqEth, ORACLE_PAYMENT);

  }


  function RequestBtcBalance(address _oracle, string _jobId,string _address)
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillBtcBalance.selector);
    req.add("get", strConcat("http://47.52.148.190:8088/balance/btc/?address=" ,_address));
    req.add("path", "data");
    req.addInt("times",1);
    sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
  }

  function RequestEthBalance(address _oracle, string _jobId,string _address)
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillEthBalance.selector);
    req.add("get", strConcat("http://47.52.148.190:8088/balance/eth/?address=" ,_address));
    req.add("path", "data");
    req.addInt("times",1);
    sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
  }

  function fulfillBtcBalance(bytes32 _requestId, uint256 _btcBalance)
    public
    recordChainlinkFulfillment(_requestId)
  {
   
    emit RequestBtcBalanceFulfilled(_requestId, _btcBalance);
    btcBalance = _btcBalance;
  }

  function fulfillEthBalance(bytes32 _requestId, uint256 _ethBalance)
    public
    recordChainlinkFulfillment(_requestId)
  {
   
    emit RequestEthBalanceFulfilled(_requestId, _ethBalance);
    ethBalance = _ethBalance;
  }

  function strConcat(string a, string b) internal pure returns (string) {
      return string(abi.encodePacked(a, b));
  }
  
  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }

}