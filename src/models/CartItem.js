const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    CARTI_id:       { type: Number, unique: true },
    CAR_id:         { type: Number },
    PRO_id:         { type: Number },
    CARTI_quantity: { type: Number },
    CARTI_price:    { type: Number }
}, { versionKey: false });

module.exports = mongoose.model("cart_items", cartItemSchema, "cart_items");