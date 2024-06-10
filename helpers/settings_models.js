const razorpay = require("razorpay");

const db = require("../config/connection");
const collection = require("../config/collection");
const { ObjectId } = require("bson");
const { reject, resolve } = require("promise");
const { addCategory } = require("./category_models");

// var instance = new razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

module.exports = {
  setDefaultSettings: () => {
    return new Promise(async (resolve, reject) => {
      const collections = await db
        .get()
        .listCollections({ name: collection.SETTINGS_COLLECTION })
        .toArray();
      if (collections.length === 0) {
        let categoryData = {
          category_arabic: "ملف العدد",
          category_english: "Mulifful Adad",
        };
        categoryData.trimmed = categoryData.category_english.trim();
        categoryData.trimmed = categoryData.trimmed.replace(/\s/g, "-");
        addCategory(categoryData).then(async () => {
          let categoryData = {
            category_arabic: "مقامة",
            category_english: "Maqamah",
          };
          categoryData.trimmed = categoryData.category_english.trim();
          categoryData.trimmed = categoryData.trimmed.replace(/\s/g, "-");
          addCategory(categoryData).then(async () => {
            let categories = await db
              .get()
              .collection(collection.CATEGORY_COLLECTION)
              .find()
              .toArray();
            await db
              .get()
              .collection(collection.SETTINGS_COLLECTION)
              .insertOne({
                settings_id: "s1",
                description: "Categories to be shown on Home page",
                category1: ObjectId(categories[0]._id),
                category2: ObjectId(categories[1]._id),
              });
          });
        });
        resolve(true);
      } else {
        console.log("Settings Collection already exists");
        resolve(true);
      }
    });
  },
  changeCategoryInHomePage: ({ category1, category2 }) => {
    return new Promise((resolve, reject) => {
      let filter = { settings_id: "s1" };

      let updateData = {
        $set: {
          category1: ObjectId(category1),
          category2: ObjectId(category2),
        },
      };
      db.get()
        .collection(collection.SETTINGS_COLLECTION)
        .updateOne(filter, updateData, (err, res) => {
          if (!err) {
            resolve(res);
          } else {
            console.error(err);
            reject(err);
          }
        });
    });
  },
  getSelectedCategories: () => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collection.SETTINGS_COLLECTION)
        .aggregate([
          {
            $match: {
              settings_id: "s1",
            },
          },
          {
            $lookup: {
              from: collection.CATEGORY_COLLECTION,
              localField: "category1",
              foreignField: "_id",
              as: "category1Details",
            },
          },
          {
            $unwind: "$category1Details",
          },
          {
            $lookup: {
              from: collection.CATEGORY_COLLECTION,
              localField: "category2",
              foreignField: "_id",
              as: "category2Details",
            },
          },
          {
            $unwind: "$category2Details",
          },
          {
            $project: {
              category1: {
                id: "$category1Details._id",
                arabic: "$category1Details.category_arabic",
                trimmed: "$category1Details.trimmed",
              },
              category2: {
                id: "$category2Details._id",
                arabic: "$category2Details.category_arabic",
                trimmed: "$category2Details.trimmed",
              },
            },
          },
        ])
        .toArray();
      category = category[0];
      resolve(category);
    });
  },
  uploadCover: (coverDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.SETTINGS_COLLECTION)
        .insertOne({
          settings_id: "s2",
          description: "Uploading of Cover editions",
          edition: coverDetails.edition,
          content: coverDetails.content,
          youtubeLink: coverDetails.youtubeLink,
          date: new Date(),
          showCover: true,
        })
        .then((result) => resolve(result));
    });
  },
  getAllCover: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let latestCover = await db
          .get()
          .collection(collection.SETTINGS_COLLECTION)
          .find({ settings_id: "s2" })
          .sort({ date: -1 })
          .toArray();
        resolve(latestCover);
      } catch (err) {
        console.log(err);
        reject({ error: err });
      }
    });
  },
  addSubscribtion: (
    {
      name,
      email,
      house,
      contact,
      whatsapp,
      place,
      state,
      district,
      pin,
      post,
    },
    amount
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        db.get()
          .collection(collection.SUBSCRIPTION_DETAILS)
          .insertOne({
            name,
            email,
            house,
            contact,
            whatsapp,
            place,
            state,
            district,
            pin,
            post,
            payment_status: "pending",
            // '06/202024' is the result of this code. I want in the format of '06/2024'.
            date: new Date().toLocaleDateString("en-GB", {
              month: "2-digit",
              year: "numeric",
            }),
          })
          .then(async (result) => {
              // var razorOrder = {
              //   amount: amount * 100,
              //   currency: "INR",
              //   payment_capture: 1,
              //   transfers: [
              //     {
              //       account: "acc_OHlu2vV0JHgsUy",
              //       amount: amount * 100,
              //       currency: "INR",
              //       notes: {
              //         branch: "Farooque Hudawi's Account",
              //         name: "Al Midad",
              //       },
              //       on_hold: 0,
              //     },
              //   ],
              // };
              
            resolve(result);
            // });
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
  updatePaymentStatus: (subscribtion_id) => {
    return new Promise(async (resolve, reject) => {
      console.log(subscribtion_id);
      let subscription = db
        .get()
        .collection(collection.SUBSCRIPTION_DETAILS)
        .find({ _id: ObjectId(subscribtion_id) });
      if (subscription) {
        db.get()
          .collection(collection.SUBSCRIPTION_DETAILS)
          .updateOne(
            { _id: ObjectId(subscribtion_id) },
            { $set: { payment_status: "completed" } }
          )
          .then((result) => {
            if (result.modifiedCount === 1) {
              console.log("Payment status updated successfully.");
              resolve({
                status: true,
                message: "Payment status updated successfully.",
              });
            } else {
              console.log("No changes made to the payment status.");
            }
          });
      }
    });
  },
  getSubscriptions: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const subscriptions = await db
          .get()
          .collection(collection.SUBSCRIPTION_DETAILS)
          .find()
          .toArray();
        resolve(subscriptions);
      } catch (error) {
        reject(error);
      }
    });
  },
};
