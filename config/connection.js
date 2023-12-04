const { MongoClient } = require('mongodb');

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

        state.db = state.client.db("Aksharam");
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports.get = function () {
    return state.db;
};
