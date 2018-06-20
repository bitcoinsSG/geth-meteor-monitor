import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import web3 from 'web3';
import './main.html';

// Collections 
import { Recent_Ethereum_Block }  from '/imports/collections';
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
  // counter starts at 0
  this.counter = new ReactiveVar(0);
  this.coinbase = new ReactiveVar('uninitialized');
  this.currentblock = new ReactiveVar('uninitialized');
  this.syncing = new ReactiveVar('uninitialized');//web4.eth.syncing.toString());
  this.peercount = new ReactiveVar('uninitialized');
  this.getwork = new ReactiveVar('uninitialized');
  this.latestblock = new ReactiveVar('uninitialized');

});

Template.hello.helpers({
  counter() {
    
    return Template.instance().counter.get();
  },
  coinbase() {
    return Template.instance().coinbase.get();
  },
  currentblock() {
    return Template.instance().currentblock.get();
  },
  syncing() {
    return Template.instance().syncing.get();
  },
  peercount() {
    return Template.instance().peercount.get();
  },
  getwork() {
    return Template.instance().getwork.get();
  },
  latestblock() {
    return Template.instance().latestblock.get();
  },
});




Template.hello.events({
  'click button'(event, instance) {
  	instance.counter.set(instance.counter.get() + 1);

  	web4.eth.getCoinbase(function(err,res){
  		instance.coinbase.set(res);

  	});



  	web4.eth.getBlockNumber(function(err,res){
  		instance.currentblock.set(res);

      web4.eth.getBlock(res,function(err,res){
        instance.latestblock.set(res.hash)
      });    

  	});



  	web4.eth.isSyncing(function(err,res){
  		instance.syncing.set(res.toString());
  	});
  	web4.eth.net.getPeerCount(function(err,res){
  		instance.peercount.set(res);
  	});
  	web4.eth.getWork(function(err,res){
  		instance.getwork.set(res.toString());
  	});

    instance.counter.set(instance.counter.get() + 1);

  },
});



Template.registerHelper('text', function(passedString, count) {
    var fooText = passedString.substring(0,count); //same as truncate.
    return new Spacebars.SafeString(fooText)
});