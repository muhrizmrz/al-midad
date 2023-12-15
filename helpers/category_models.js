const db = require('../config/connection')
const collection = require('../config/collection')
const { ObjectId } = require('bson')

module.exports = {
    addCategory: (categoryData) => {
        return new Promise((resolve, reject) => {
            categoryData.trimmed = categoryData.category_english.trim()
            categoryData.trimmed = categoryData.trimmed.replace(/\s/g, '-')
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(categoryData)
                .then(result => {
                    resolve({ status: true, message: "Category Added Successfully" })
                }).catch(err => {
                    console.error(err);
                    resolve({ status: false, error: err })
                });
        });

    },
    getCategories: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).find()
                .toArray()
                .then(categories => {
                    resolve(categories)
                }).catch(err => {
                    console.error(err);
                    resolve([])
                });
        });
    },
    editCategory: (categoryId,categoryData) => {
        return new Promise((resolve,reject)=>{
            categoryData.trimmed = categoryData.category_english.trim()
            categoryData.trimmed = categoryData.trimmed.replace(/\s/g, '-')
            db.get().collection(collection.CATEGORY_COLLECTION)
            .updateOne({_id: ObjectId(categoryId)},{
                $set: {
                    category_arabic: categoryData.category_arabic, 
                    category_english: categoryData.category_english,
                    trimmed : categoryData.trimmed
                }
            }).then((result)=>{
                resolve(result)
            })
        })
    }
}