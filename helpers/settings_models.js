const db = require('../config/connection')
const collection = require('../config/collection')
const { ObjectId } = require('bson')
const { reject } = require('promise')
const { addCategory } = require('./category_models')

module.exports = {
    setDefaultSettings: () => {
        return new Promise(async (resolve, reject) => {
            const collections = await db.get().listCollections({ name: collection.SETTINGS_COLLECTION }).toArray();
            if (collections.length === 0) {
              let categoryData = {
                category_arabic: "ملف العدد",
                category_english: "Mulifful Adad"
              }
              categoryData.trimmed = categoryData.category_english.trim()
              categoryData.trimmed = categoryData.trimmed.replace(/\s/g, '-')
              addCategory(categoryData).then(async() => {
                let categoryData = {
                  category_arabic: "مقامة",
                  category_english: "Maqamah"
                }
                categoryData.trimmed = categoryData.category_english.trim()
                categoryData.trimmed = categoryData.trimmed.replace(/\s/g, '-')
                addCategory(categoryData).then(async()=>{
                  let categories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()  
                  await db.get().collection(collection.SETTINGS_COLLECTION).insertOne({
                    settings_id: 's1',
                    description: 'Categories to be shown on Home page',
                    category1: ObjectId(categories[0]._id),
                    category2: ObjectId(categories[1]._id)
                  })
                })
              
              })
              resolve(true)
            } else {
              console.log("Settings Collection already exists")
              resolve(true)
            }
        })
    },
    changeCategoryInHomePage: ({ category1, category2 }) => {
        return new Promise((resolve, reject) => {
            let filter = { settings_id: 's1' }

            let updateData = {
                $set: {
                    category1: ObjectId(category1),
                    category2: ObjectId(category2)
                }
            }
            db.get()
                .collection(collection.SETTINGS_COLLECTION)
                .updateOne(filter, updateData, (err, res) => {
                    if (!err) {
                        resolve(res);
                    } else {
                        console.error(err)
                        reject(err);
                    }
                });
        })

    },
    getSelectedCategories: () => {
        return new Promise(async(resolve,reject)=>{
            let category = await db.get().collection(collection.SETTINGS_COLLECTION).aggregate([
                {
                  $match: {
                    settings_id: 's1'
                  }
                },
                {
                  $lookup: {
                    from: collection.CATEGORY_COLLECTION,
                    localField: "category1",
                    foreignField: "_id",
                    as: "category1Details"
                  }
                },
                {
                  $unwind: "$category1Details"
                },
                {
                  $lookup: {
                    from: collection.CATEGORY_COLLECTION,
                    localField: "category2",
                    foreignField: "_id",
                    as: "category2Details"
                  }
                },
                {
                  $unwind: "$category2Details"
                },
                {
                  $project: {
                    category1: {
                      id: "$category1Details._id",
                      arabic: "$category1Details.category_arabic",
                      trimmed: "$category1Details.trimmed"
                    },
                    category2: {
                      id: "$category2Details._id",
                      arabic: "$category2Details.category_arabic",
                      trimmed: "$category2Details.trimmed"
                    }
                  }
                }
              ]).toArray()
              category = category[0];
              resolve(category)
        })
    },
    uploadCover: (coverDetails) => {
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.SETTINGS_COLLECTION).insertOne({
          settings_id: 's2',
          description: 'Uploading of Cover editions',
          edition: coverDetails.edition,
          content: coverDetails.content,
          date: new Date(),
          showCover: true
        }).then(result => resolve(result));
      })
    },
    getAllCover: () => {
      return new Promise(async(resolve,reject)=>{
        try {
          let latestCover = await db.get().collection(collection.SETTINGS_COLLECTION).find({settings_id: 's2'}).sort({date:-1}).toArray();
          resolve(latestCover)
        } catch (err){
          console.log(err);
          reject({error:err,});
        }
      })
    }
}