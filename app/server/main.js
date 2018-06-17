import { Meteor } from 'meteor/meteor';
const Web3 = require('web3');
//import { Web3 } from 'meteor/ethereum:web3';
const XMLHttpRequest = require('xhr2').XMLHttpRequest;

Meteor.startup(() => {
  // code to run on server at startup
  console.log("Server started");

});

const web4 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

web4.eth.net.getPeerCount(function(error,result){
	console.log(result);

});

/*
var filter = web4.eth.filter('latest');


filter.watch(function(error, result){
  	if (!error){
  	console.log(result);
  	}
});

*/