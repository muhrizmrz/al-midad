const mongoClient = require('mongodb').MongoClient

const state = {
    db: null
}
module.exports.connect = function(done){
    const url = process.env.MY_MONGO_URI || "mongodb://127.0.0.1:27017"
    const dbname = 'Aksharam'
    mongoClient.connect(url,(err,data)=>{
        if(err) done(err)
        state.db=data.db(dbname)
    })
    done()
}

module.exports.get = function(){
    return state.db
}
