const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema({
    DET_id:         { type: Number, unique: true },
    ORD_id:         { type: Number },
    PRO_id:         { type: Number },
    DET_quantity:   { type: Number },
    DET_unit_price: { type: Number }
}, { versionKey: false });


module.exports = mongoose.model("order_detail", orderDetailSchema, "order_detail")