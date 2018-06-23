import { Mongo } from 'meteor/mongo';

export const Recent_Ethereum_Blocks = new Mongo.Collection("Recent_Ethereum_Blocks");

export const Syncing = new Mongo.Collection("Syncing");

export const PeerCount = new Mongo.Collection("PeerCount");

export const ContractState = new Mongo.Collection("ContractState");

/*
Meteor.publish("Latest_Ethereum_Block_publish", function () {
        return Recent_Ethereum_Block.find({},{"sort": {"date_created":-1}, "limit":1});
});
*/
