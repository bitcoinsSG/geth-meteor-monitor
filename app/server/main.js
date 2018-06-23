//import important files
import { Meteor } from 'meteor/meteor';
//import database collections
import { Mongo } from 'meteor/mongo';
import { Recent_Ethereum_Blocks } from '/imports/collections';
import { Syncing } from '/imports/collections';
import { PeerCount } from '/imports/collections';
import { ContractState } from '/imports/collections';


const Web3 = require('web3');
const web4 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const web4websocket = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
const XMLHttpRequest = require('xhr2').XMLHttpRequest;
var etherpriceinusd = 0;


Meteor.startup(() => {
  // code to run on server at startup
  console.log("Server started");
  etherpriceinusd = JSON.parse(HTTP.call('GET','https://api.coinmarketcap.com/v1/ticker/ethereum/').content)[0].price_usd;

});


var subscription = web4websocket.eth.subscribe('newBlockHeaders', function(error, result){
    if (error)
        console.log(error);
}).on("data", Meteor.bindEnvironment(function(blockHeader){
  update_Recent_Ethereum_Block_db(blockHeader,Recent_Ethereum_Blocks);
  update_other_details();
  console.log(blockHeader.number);
}));





function update_Recent_Ethereum_Block_db(blockHeader) {
    if (Recent_Ethereum_Blocks.find({}).count() < 10){
        Recent_Ethereum_Blocks.insert({hash : blockHeader['hash'],height:blockHeader['number'],time:blockHeader['timestamp'], date_created: new Date()});
    }
    else{
        var earliest_block=Recent_Ethereum_Blocks.findOne({},{"sort": {"date_created":1}, "limit" : 1});
        Recent_Ethereum_Blocks.update(earliest_block._id,{$set: {hash : blockHeader['hash'],height:blockHeader['number'],time:blockHeader['timestamp'], date_created: new Date()}});
    }
}


function update_other_details(){
  // update all essential variables and put them into their own collections
  // update syncing status
  web4.eth.isSyncing(Meteor.bindEnvironment(function(err,res){
    (err) ? console.log(err) : Syncing.insert({status :  res.toString(), date_created: new Date()});
  }));
  // update peer count
  web4.eth.net.getPeerCount(Meteor.bindEnvironment(function(err,res){
    (err) ? console.log(err) : PeerCount.insert({count :  res, date_created: new Date()});
  }));
  //update metronome circulation
  var contractAddress = "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e";
  var totalSupplyHex = web4.utils.sha3('totalSupply()').substring(0,10);
  var totalSupplyCall = getDataObj(contractAddress, totalSupplyHex, []);
  web4.eth.call(totalSupplyCall,Meteor.bindEnvironment(function(err,res){
    if(err) console.log(err);
    else{
      var percent=parseInt((res))/100000000000000000000000;
      // get price in ether
      contractAddress = "0x9d9BcDd249E439AAaB545F59a33812E39A8e3072";
      var currentPriceHex = web4.utils.sha3('currentPrice()').substring(0,10);
      var currentPriceCall = getDataObj(contractAddress, currentPriceHex, []);
      web4.eth.call(currentPriceCall,Meteor.bindEnvironment(function(err,res){

        var priceineth=parseInt((res))/1000000000000000000;
        var metpriceinusd = priceineth * etherpriceinusd;
        metpriceinusd=metpriceinusd.toPrecision(7);
        priceineth=priceineth.toPrecision(7);

        ContractState.insert({priceineth : priceineth, priceinusd : metpriceinusd, percent :  percent, date_created: new Date()});
      }));
    }
  }));






}



// get ethereum price every 20 secs
/*
Meteor.bindEnvironment(setInterval(function() {
    var etherpriceinusd = JSON.parse(HTTP.call('GET','https://api.coinmarketcap.com/v1/ticker/ethereum/').content)[0].price_usd;
    console.log(etherpriceinusd);
}, 6 * 1000));
*/


//utility functions

getDataObj = function(to, func, arrVals) {
    var val = "";
    for (var i = 0; i < arrVals.length; i++) val += this.padLeft(arrVals[i], 64);
    return {
        to: to,
        data: func + val
    };
}

//web4.eth.net.getPeerCount(function(error,result){	console.log(result);});


//var filterf = web4.eth.filter('latest');

/*
filter.watch(function(error, result){
  	if (!error){
  	console.log(result);
  	}
});
*/



