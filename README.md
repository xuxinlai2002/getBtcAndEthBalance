# api
1.获得余额
比特币:
.https://blockchain.info/balance?active=1MDUoxL1bGvMxhuoDYx6i11ePytECAk9QK
以太坊:
https://api.etherscan.io/api?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest&apikey=YourApiKeyToken


本地测试:
# 合并
http://localhost:8088/balance?btcAddress=1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj&ethAddress=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae
http://47.52.148.190:8088/balance?btcAddress=1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj&ethAddress=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae

# 分开 
## btc
http://localhost:8088/balance/btc?address=1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj
http://47.52.148.190:8088/balance/btc?address=1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj

## eth
http://localhost:8088/balance/eth?address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae
http://47.52.148.190:8088/balance/eth?address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae




# sol
2.合约调用

# spec
3.getBtcAndEthBalance

4.服务器部署

"0x99e42d431147540d09d2651eb3380e7ef49ed55e","83eaab0f270f4207ba0c05bb4e50675b","1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj"
"0x99e42d431147540d09d2651eb3380e7ef49ed55e","83eaab0f270f4207ba0c05bb4e50675b","0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"



"0xdcf15ea52D91330D0f70Ab52aB70e26fd666e4C1","5609039c29e140bbafd551b93e96053e","1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj"
"0xdcf15ea52D91330D0f70Ab52aB70e26fd666e4C1","5609039c29e140bbafd551b93e96053e","0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"
测试环境合约地址
0x70D5fF48394fab817b64c128C78a751c433c7101







///
1.
link的地址变了，改成了0xde71243d1bbb402e38779805a42e2e13158a75bf ，你这边如果要测试的话需要重新部署一下你的oracle

2.
arbiter address : 0x289e47aC1d5C4CD0587B8f7871bE62617aa035B2 arbiter的地址。

3.
你需要注册把部分超级节点改成你自己的oracle。调用registerArbiter方法



























