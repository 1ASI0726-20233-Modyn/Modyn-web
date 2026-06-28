const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    CAT_id:          { type: Number },
    CAT_name:        { type: String },
    CAT_description: { type: String }
}, { versionKey: false });

module.exports = mongoose.model("categories", categorySchema);