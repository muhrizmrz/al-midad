const db = require('../config/connection')
const collection = require('../config/collection')
const { marked } = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { ObjectId } = require('bson')
const dompurify = createDomPurify(new JSDOM().window)

module.exports = {
    addNews:(news)=>{
        return new Promise((resolve,reject)=>{
            news.date = new Date().toISOString().slice(0,10)
            news.markdown = dompurify.sanitize(marked(news.news_content))

            db.get().collection(collection.NEWS_COLLECTION).insertOne(news).then((result)=>{
                resolve(result)  
            })
        })
    },
    getRecentNews:()=>{
        return new Promise(async(resolve,reject)=>{
            let newsDb = await db.get().collection(collection.NEWS_COLLECTION).find().sort({date:-1}).limit(3).toArray()
            resolve(newsDb)
        })
    },
    updateNews: (newsId,newsDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NEWS_COLLECTION)
            .updateOne({_id:ObjectId(newsId)},{
                $set: {
                    title: newsDetails.title,
                    news_content: newsDetails.news_content,
                    markdown: dompurify.sanitize(marked(newsDetails.news_content))
                }
            }).then((result)=>{
                resolve(result)
            })
        })
    },
    deleteNews:(newsId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.NEWS_COLLECTION).deleteOne({_id:ObjectId(newsId)}).then((result)=>{
                resolve(result)
            })
        })
    }
}