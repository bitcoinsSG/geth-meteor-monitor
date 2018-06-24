//scratch logic to get transaction to a certain address scanning the blockchain from predefined start block number]
// execution is very slow

var n = eth.blockNumber;
var the_address = '0x9d9BcDd249E439AAaB545F59a33812E39A8e3072';
the_address = the_address.toLowerCase();
var startBlock = 5844631;

var txs = [];
for(var i = startBlock; i < n; i++) {
    var block = eth.getBlock(i, true);
    for(var j = 0; j < block.transactions.length; j++) {
        if( block.transactions[j].to == the_address )
            txs.push(block.transactions[j]);
    }
}



for(var i= 0; i < txs.length;i++){
	txs[i].gasUsed=eth.getTransactionReceipt(txs[i].hash).gasUsed;
	txs[i].cumulativeGasUsed=eth.getTransactionReceipt(txs[i].hash).cumulativeGasUsed;
	txs[i].status=eth.getTransactionReceipt(txs[i].hash).status;
}


console.log('done');

