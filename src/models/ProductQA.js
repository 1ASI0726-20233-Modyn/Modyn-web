const mongoose = require("mongoose");

const productQASchema = new mongoose.Schema({
    QA_id:         { type: Number },
    PRO_id:        { type: Number },
    USU_id:        { type: Number },
    QA_question:   { type: String },
    QA_answer:     { type: String },
    QA_created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("product_qa", productQASchema, "product_qa")