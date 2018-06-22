//import important files
import { Meteor } from 'meteor/meteor';
//import database collections
import { Mongo } from 'meteor/mongo';
import { Recent_Ethereum_Blocks } from '/imports/collections';
import { Syncing } from '/imports/collections';
import { PeerCount } from '/imports/collections';


const Web3 = require('web3');
const web4 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const web4websocket = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
const XMLHttpRequest = require('xhr2').XMLHttpRequest;

Meteor.startup(() => {
  // code to run on server at startup
  console.log("Server started");

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



