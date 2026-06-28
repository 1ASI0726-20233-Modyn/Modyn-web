const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
    WIST_id:         { type: Number },
    WIS_id:          { type: Number },
    PRO_id:          { type: Number },
    WIST_created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("wishlist_items", wishlistItemSchema, "wishlist_items");