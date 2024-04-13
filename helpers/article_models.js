const { reject, resolve } = require('promise')
const db = require('../config/connection')
const collection = require('../config/collection')
const { marked } = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { ObjectId } = require('bson')
const dompurify = createDomPurify(new JSDOM().window)

module.exports = {
    getAllArticles: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let articles = await db.get().collection(collection.ARTICLE_COLLECTION).aggregate([
                    {
                        $project: {
                            _id: 1,
                            topic: 1,
                            author: 1,
                            date: 1,
                        }
                    }
                ]).toArray()
                resolve(articles)

            } catch (err) {
                reject({ error: err, msg: "Error" })
            }
        })
    },
    addArticle: (article) => {
        return new Promise((resolve, reject) => {
            article.date = new Date().toISOString().slice(0, 10)
            article.markdown = dompurify.sanitize(marked(article.article))
            article.viewCount = 0;
            article.category = ObjectId(article.category)
            db.get().collection(collection.ARTICLE_COLLECTION).insertOne(article).then((result) => {
                resolve(result)
            })
        })
    },
    getRecentArticles: () => {
        return new Promise(async (resolve, reject) => {
            let articleDb = await db.get().collection(collection.ARTICLE_COLLECTION).find().sort({ date: -1 }).limit(4).toArray()
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
                        date: 1,
                        category: "$recentArticles.category_arabic",
                        category_id: "$recentArticles.trimmed"
                    }
                }
            ]).toArray()

            // Fetch the results of the aggregation pipeline
            resolve(aggregatedArticles)
        })
    },
    getArticleById: (articleId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let article = await db.get().collection(collection.ARTICLE_COLLECTION).aggregate([
                    {
                        $match: {
                            _id: ObjectId(articleId)
                        }
                    },
                    {
                        $lookup: {
                            from: collection.CATEGORY_COLLECTION,
                            localField: "category",
                            foreignField: "_id",
                            as: "categoryInfo"
                        }
                    },
                    {
                        $unwind: "$categoryInfo"
                    },
                    {
                        $project: {
                            _id: 1,
                            topic: 1,
                            author: 1,
                            author_credential: 1,
                            date: 1,
                            markdown: 1,
                            article: 1,
                            viewCount: 1,
                            category: "$categoryInfo.category_arabic",
                            trimmedCategory: "$categoryInfo.trimmed"
                        }
                    }
                ]).toArray();

                function formateDate(date) {
                    var months = [
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                    ];

                    date = new Date(date);
                    const day = date.getDate();
                    const month = months[date.getMonth()];
                    const year = date.getFullYear()
                    return `${year} ${month} ${day}`;
                }
                article[0].formattedDate = formateDate(article[0].date);
                resolve(article[0])
            } catch (error) {
                console.log('Error in getting Article by Id : ', error);
                reject(error);
            }
        })
    },
    IncrementArticleViewCount: (articleId) => {
        return new Promise(async (resolve, reject) => {
            let article = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({ _id: ObjectId(articleId) });
            if (article.viewCount) {
                db.get().collection(collection.ARTICLE_COLLECTION)
                    .updateOne({ _id: ObjectId(articleId) }, {
                        $inc: { viewCount: 1 },
                    }).then((result) => {
                        resolve(result)
                    })
            } else {
                db.get().collection(collection.ARTICLE_COLLECTION)
                    .updateOne({ _id: ObjectId(articleId) }, {
                        $set: { viewCount: 1 }
                    }).then((result) => {
                        resolve(result)
                    })
            }
        })

    },
    getArticlesByCategory: (categoryType, noOfArticles) => {
        return new Promise(async (resolve, reject) => {

            let categoryElement = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({ trimmed: categoryType })

            let pipeline;
            if (categoryElement) {
                pipeline = [{
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
                    $sort: {
                        date: -1
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
                        date: 1,
                        category: "$recentArticles.category_arabic",
                        category_id: "$recentArticles.trimmed"
                    }
                }]
            }
            if (noOfArticles !== null) {
                pipeline.push({
                    $limit: noOfArticles
                });
            }
            let filtered = await db.get().collection(collection.ARTICLE_COLLECTION).aggregate(pipeline).toArray()
            resolve(filtered);
        })
    },
    updateArticle: (article_id, articleDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ARTICLE_COLLECTION)
                .updateOne({ _id: ObjectId(article_id) }, {
                    $set: {
                        topic: articleDetails.topic,
                        author: articleDetails.author,
                        author_credential: articleDetails.author_credential,
                        article: articleDetails.article,
                        category: articleDetails.category && ObjectId(articleDetails.category),
                        markdown: dompurify.sanitize(marked(articleDetails.article))
                    }
                }).then((result) => {
                    resolve(result)
                })
        })
    },
    deleteArticle: (articleId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ARTICLE_COLLECTION).deleteOne({ _id: ObjectId(articleId) }).then((result) => {
                resolve(result)
            })
        })
    }
}