const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    CAR_id:         { type: Number, unique: true },
    USU_id:         { type: Number },
    CAR_created_at: { type: Date, default: Date.now }
}, { versionKey: false });


module.exports = mongoose.model("cart", cartSchema, "cart");