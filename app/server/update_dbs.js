//import dbs
const Web3 = require('web3');
import { Recent_Ethereum_Block } from '/db/collections';

const web4websocket = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));



var subscription = web4websocket.eth.subscribe('newBlockHeaders', function(error, result){
    if (error)
        console.log(error);
})
.on("data", function(blockHeader){

//Recent_Ethereum_Block.insert({hash : blockHeader['hash']});
//update_Recent_Ethereum_Block_db(blockHeader)
console.log(blockHeader.number);
});


console.log('what');