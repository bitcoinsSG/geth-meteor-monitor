
const Web3 = require('web3');
var web5 =  new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
//var web5 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
var subscription = web5.eth.subscribe('newBlockHeaders', function(error, result){
    if (error)
        console.log(error);
})
.on("data", function(blockHeader){
console.log(blockHeader);
});


//web5.eth.subscribe("pendingTransactions").then(function(res,err){ console.log(res)});

/*
var filter = web5.eth.filter('latest');


filter.watch(function(error, result){
  	if (!error){
  	console.log(result);
  	}
});
*/

