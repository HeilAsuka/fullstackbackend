require("dotenv").config();
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const url = process.env.MONGODB_URI;
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
console.log("connecting to MongoDB Atlas");
mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connected successfully");
    })
    .catch((err) =>
        console.log("failed to connect to MongoDB Atlas:", err.message)
    );

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, unique: true },
    number: { type: String, minlength: 8, required: true },
    id: Number,
});
personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
    transform: (document, retrunedObject) => {
        delete retrunedObject._id;
        delete retrunedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
