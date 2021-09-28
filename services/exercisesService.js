//importing mongodb
const mongo = require("../shared/mongo");

const { ObjectId } = require("mongodb");

const service = {
  getExercises() {
    return mongo.db.collection("exercises").find().toArray();
  },
  getExercise(id) {
    return mongo.db.collection("exercises").findOne({ _id: ObjectId(id) });
  },
  addExercises(data) {
    return mongo.db.collection("exercises").insert(data);
  },
  updateExercise(id, data) {
    return mongo.db
      .collection("exercises")
      .findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: data },
        { returnDocument: "after" }
      );
  },
  deleteExercise(id){
      return mongo.db.collection("exercises").deleteOne({_id : ObjectId(id)});
  }
};

module.exports = service;
