const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('products')
            .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this}, {upsert: true})
                .then(result => {
                    //console.log(result);
                    console.log(`modified count: ${result.modifiedCount}`);
                    console.log(`upserted count: ${result.upsertedCount}`);
                    console.log(`matched count: ${result.matchedCount}`);
                })
                .catch(err => console.log(err));

    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                //console.log(products);
                return products;
            })
            .catch(err => console.log(err));
    }

    static fetchOne(id) {
        const db = getDb();
        return db.collection('products')
            .find({_id: new mongodb.ObjectId(id)})
            .next()
            .then(product => {
                console.log('I am a single product', product);
                return product;
            })
            .catch(err => console.log(err));
    }

    static update(id, title, price, imageUrl, description) {
        const db = getDb();
        return db.collection('products')
            .updateOne({_id: new mongodb.ObjectId(id)}, {$set: {title: title, price: price, imageUrl: imageUrl, description: description}})
            .then(product => {
                return product;
            })
            .catch(err => console.log(err));
    }

    static delete(id) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({_id: new mongodb.ObjectId(id)})
            .then(result => {
               console.log("from Product file", result.deletedCount);
               return result;
            })
            .catch(err => console.log(err));
    }
}


module.exports = Product;