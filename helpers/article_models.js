const { reject, resolve } = require('promise')
const db = require('../config/connection')
const collection = require('../config/collection')
const { marked } = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { ObjectId } = require('bson')
const dompurify = createDomPurify(new JSDOM().window)

module.exports = {
    addArticle:(article)=>{
        return new Promise((resolve,reject)=>{
            article.date = new Date().toISOString().slice(0,10)
            article.markdown = dompurify.sanitize(marked(article.article))
            article.category = ObjectId(article.category)
            db.get().collection(collection.ARTICLE_COLLECTION).insertOne(article).then((result)=>{
                resolve(result)  
            })
        })
    },
    getRecentArticles:()=>{
        return new Promise(async(resolve,reject)=>{
            let articleDb = await db.get().collection(collection.ARTICLE_COLLECTION).find().sort({date:-1}).limit(4).toArray()
            let aggregatedArticles = await db.get().collection(collection.ARTICLE_COLLECTION).aggregate([
                {
                    $match: {
                        _id: { $in: articleDb.map(article => article._id) }
                    }
                },
                {
                    $lookup: {
                        from: collection.CATEGORY_COLLECTION,
                        localField: "category",
                        foreignField: "_id",
                        as: "recentArticles"
                    }
                },
                {
                    $unwind: "$recentArticles"
                },
                {
                    $project: {
                        _id: 1,
                        topic: 1,
                        author: 1,
                        category: "$recentArticles.category_arabic",
                        category_id: "$recentArticles.trimmed"
                    }
                }
            ]).toArray()
            
            // Fetch the results of the aggregation pipeline
            resolve(aggregatedArticles)
        })
    },
    getArticlesByCategory: (categoryType) => {
        return new Promise(async (resolve, reject) => {

            let categoryElement = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({trimmed:categoryType})

            let filtered = await db.get().collection(collection.ARTICLE_COLLECTION).aggregate([
                {
                    $match: {
                        category: ObjectId(categoryElement._id)
                    }
                },
                {
                    $lookup: {
                        from: collection.CATEGORY_COLLECTION,
                        localField: "category",
                        foreignField: "_id",
                        as: "recentArticles"
                    }
                },
                {
                    $unwind: "$recentArticles"
                },
                {
                    $project: {
                        _id: 1,
                        topic: 1,
                        author: 1,
                        markdown: 1,
                        category: "$recentArticles.category_arabic",
                        category_id: "$recentArticles.trimmed"
                    }
                }
            ]).toArray()
           // let articles = await db.get().collection(collection.ARTICLE_COLLECTION).find({ category: categoryType }).sort({ date: -1}).limit(2).toArray();
            resolve(filtered);
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
                   category: articleDetails.category && ObjectId(articleDetails.category),
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