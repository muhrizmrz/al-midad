const { MongoClient } = require('mongodb');

const { ObjectId } = require('bson')

const { addCategory } = require('../helpers/category_models');
const db = require('../config/connection')
const collection = require('./collection')

const state = {
    db: null,
    client: null // Store the client reference to keep the connection open
};

module.exports.connect = async function () {
    try {
        state.client = new MongoClient(process.env.MY_MONGO_URI, { //mongodb+srv://muhriz:zirhum286@cluster0.4hhp2.mongodb.net/?retryWrites=true&w=majority
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await state.client.connect();
        let dbName = process.env.DBNAME; //test2
        state.db = state.client.db(dbName); //Aksharam

        this.setDefaultSettings()
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports.get = function () {
    return state.db;
};

module.exports.setDefaultSettings = async function () {
    const collections = await state.db.listCollections({ name: collection.SETTINGS_COLLECTION }).toArray();
    if (collections.length === 0) {
        let categoryData = {
            category_arabic: "ملف العدد",
            category_english: "Mulifful Adad"
        }
        categoryData.trimmed = categoryData.category_english.trim()
        categoryData.trimmed = categoryData.trimmed.replace(/\s/g, '-')
        addCategory(categoryData).then(async () => {
            let categoryData = {
                category_arabic: "مقامة",
                category_english: "Maqamah"
            }
            categoryData.trimmed = categoryData.category_english.trim()
            categoryData.trimmed = categoryData.trimmed.replace(/\s/g, '-')
            addCategory(categoryData).then(async () => {
                let categories = await state.db.collection(collection.CATEGORY_COLLECTION).find().toArray()
                await state.db.collection(collection.SETTINGS_COLLECTION).insertOne({
                    settings_id: 's1',
                    description: 'Categories to be shown on Home page',
                    category1: ObjectId(categories[0]._id),
                    category2: ObjectId(categories[1]._id)
                })
            })

        })
    } else {
        console.log("Settings Collection already exists")
    }
}
