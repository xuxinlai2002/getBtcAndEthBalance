pragma solidity 0.4.24;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/vendor/Ownable.sol";

contract btcAndEthBalanceConsumer is ChainlinkClient, Ownable {

  uint256 constant private ORACLE_PAYMENT = 1 * LINK;
  uint256 public btcBalance;
  uint256 public ethBalance;

  event RequestBtcAndEthBalanceFulfilled(
    bytes32 indexed requestId,
    uint256 indexed btcBalance,
    uint256 indexed ethBalance
  );
  
  //set link token TODO do need
  constructor() public Ownable() {
    setPublicChainlinkToken();
  }

  function RequestBtcAndEthBalance(address _oracle, string _jobId,string _btcAddress)
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillBtchAndEthBalance.selector);
    req.add("get", "http://localhost:8080/balance?btcAddress=1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj");
    req.add("path", "btc");
    req.addInt("times", 100);
    sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
  }

  function fulfillBtchAndEthBalance(bytes32 _requestId, uint256 _btcBalance)
    public
    recordChainlinkFulfillment(_requestId)
  {
    //TODO ...  
    emit RequestBtcAndEthBalanceFulfilled(_requestId, _btcBalance,0);
    btcBalance = _btcBalance;
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