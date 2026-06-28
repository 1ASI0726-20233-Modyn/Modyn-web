const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    WIS_id:         { type: Number },
    USU_id:         { type: Number },
    WIS_created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("wishlist", wishlistSchema, "wishlist");