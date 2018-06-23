import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import web3 from 'web3';
import './main.html';

// Collections 
import { Recent_Ethereum_Blocks } from '../imports/collections.js';
import { Syncing } from '/imports/collections';
import { PeerCount } from '/imports/collections';
import { ContractState } from '/imports/collections';
// Collections


const web4 = new web3(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

console.log("hello");
console.log(web4.version);
//console.log(Recent_Ethereum_Block.findOne({}).height);

/*
var qwer=Recent_Ethereum_Block.findOne({}, {
            "sort": {
                "date_created": -1
            }
        });
console.log(qwer);
*/



Template.hello.onCreated(function helloOnCreated() {
  //this.counter = new ReactiveVar(0);
  this.coinbase = new ReactiveVar('uninitialized');
  this.currentblock = new ReactiveVar('uninitialized');
  this.syncing = new ReactiveVar('uninitialized');//web4.eth.syncing.toString());
  this.peercount = new ReactiveVar('uninitialized');
  this.getwork = new ReactiveVar('uninitialized');
  this.latestblock = new ReactiveVar('uninitialized');

});

Template.hello.helpers({
  currentblock() {
    return Template.instance().currentblock.get();
  },
  syncing() {
    var syncState = Syncing.findOne({},{"sort": {"date_created":-1}, "limit":1});
    if(syncState == null ) return 'connecting';
    else if (syncState.status != 'false') return 'syncing';
    else return 'live';
  },
  peercount() {
    return PeerCount.findOne({},{"sort": {"date_created":-1}, "limit":1});
  },
  latestblock() {
    return Template.instance().latestblock.get();
  },
  Latest_Ethereum_Block() {
        return Recent_Ethereum_Blocks.findOne({},{"sort": {"date_created":-1}, "limit":1});
  },
  ContractStatePercent() {
        return ContractState.findOne({},{"sort": {"date_created":-1}, "limit":1});
  },
});




Template.hello.events({
  'click button'(event, instance) {
  //	instance.counter.set(instance.counter.get() + 1);
/*
  	web4.eth.isSyncing(function(err,res){
  		instance.syncing.set(res.toString());
  	});
  	web4.eth.net.getPeerCount(function(err,res){
  		instance.peercount.set(res);
  	});
*/
  },
});



Template.registerHelper('text', function(passedString, count) {
    var fooText = passedString.substring(0,count); //same as truncate.
    return new Spacebars.SafeString(fooText)
});