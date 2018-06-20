import { Mongo } from 'meteor/mongo';

export var Recent_Ethereum_Block = new Mongo.Collection("Recent_Ethereum_Block");
/*
Meteor.publish("Latest_Ethereum_Block_publish", function () {
        return Recent_Ethereum_Block.find({},{"sort": {"date_created":-1}, "limit":1});
});
*/