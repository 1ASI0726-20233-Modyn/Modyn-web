const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    ADD_id:      { type: Number, unique: true },
    USU_id:      { type: Number },
    ADD_address: { type: String },
    ADD_city:    { type: String },
    ADD_country: { type: String },
    ADD_zipcode: { type: String }
}, { versionKey: false });

module.exports = mongoose.model("addresses", addressSchema);