const { reject, resolve } = require('promise')
const db = require('../confiq/connection')
const collection = require('../confiq/collection')
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { ObjectId } = require('bson')
const dompurify = createDomPurify(new JSDOM().window)

module.exports = {
    addArticle:(article)=>{
        return new Promise((resolve,reject)=>{
            article.date = new Date().toISOString().slice(0,10)
            article.markdown = dompurify.sanitize(marked(article.article))

            db.get().collection(collection.ARTICLE_COLLECTION).insertOne(article).then((result)=>{
                resolve(result)  
            })
        })
    },
    getRecentArticles:()=>{
        return new Promise(async(resolve,reject)=>{
            let articleDb = await db.get().collection(collection.ARTICLE_COLLECTION).find().sort({date:-1}).limit(4).toArray()
            
            console.log(new Date().toISOString().slice(0,10))
            //console.log(articleDb)
            resolve(articleDb)
        })
    },
    updateArticle:(article_id,articleDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ARTICLE_COLLECTION)
            .updateOne({_id:ObjectId(article_id)},{
                $set:{
                   topic: articleDetails.topic, 
                   author: articleDetails.author,
                   article: articleDetails.article, 
                   catagory: articleDetails.catagory,
                   markdown: dompurify.sanitize(marked(articleDetails.article))
                }
            }).then((result)=>{
                resolve(result)
            })
        })
    },
    deleteArticle:(articleId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ARTICLE_COLLECTION).deleteOne({_id:ObjectId(articleId)}).then((result)=>{
                resolve(result)
            })
        })
    }
}