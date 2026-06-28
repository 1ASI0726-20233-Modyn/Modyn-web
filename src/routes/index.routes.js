const { Router } = require("express");
const router = Router();

// Importar todos los modelos
const User               = require("../models/User");
const Address            = require("../models/Address");
const Session            = require("../models/Session");
const Category           = require("../models/Category");
const Supplier           = require("../models/Supplier");
const Product            = require("../models/Product");
const ProductImage       = require("../models/ProductImage");
const ProductVariant     = require("../models/ProductVariant");
const Review             = require("../models/Review");
const ReviewImage        = require("../models/ReviewImage");
const ProductLike        = require("../models/ProductLike");
const ProductQA          = require("../models/ProductQA");
const ProductView        = require("../models/ProductView");
const Wishlist           = require("../models/Wishlist");
const WishlistItem       = require("../models/WishlistItem");
const Cart               = require("../models/Cart");
const CartItem           = require("../models/CartItem");
const CartHistory        = require("../models/CartHistory");
const Coupon             = require("../models/Coupon");
const CouponUsage        = require("../models/CouponUsage");
const Order              = require("../models/Order");
const OrderDetail        = require("../models/OrderDetail");
const Payment            = require("../models/Payment");
const Shipment           = require("../models/Shipment");
const Return             = require("../models/Return");
const Notification       = require("../models/Notification");
const NotificationEvent  = require("../models/NotificationEvent");
const Recommendation     = require("../models/Recommendation");
const RecommendationItem = require("../models/RecommendationItem");

// Usuarios
router.use("/users",     require("./usuarios/users.routes"));
// router.use("/addresses", require("./usuarios/addresses.routes"));
// router.use("/sessions",  require("./usuarios/sessions.routes"));

// Catálogo
// router.use("/categories",     require("./catalogo/categories.routes"));
// router.use("/suppliers",      require("./catalogo/suppliers.routes"));
// router.use("/products",       require("./catalogo/products.routes"));
// router.use("/product-images", require("./catalogo/productImages.routes"));
// router.use("/variants",       require("./catalogo/productVariants.routes"));
// router.use("/likes",          require("./catalogo/productLikes.routes"));
// router.use("/qa",             require("./catalogo/productQA.routes"));
// router.use("/views",          require("./catalogo/productViews.routes"));

// Carrito
// router.use("/cart",         require("./carrito/cart.routes"));
// router.use("/cart-items",   require("./carrito/cartItems.routes"));
// router.use("/cart-history", require("./carrito/cartHistory.routes"));

// Wishlist
// router.use("/wishlist",       require("./wishlist/wishlist.routes"));
// router.use("/wishlist-items", require("./wishlist/wishlistItems.routes"));

// Pedidos
// router.use("/orders",       require("./pedidos/orders.routes"));
// router.use("/order-detail", require("./pedidos/orderDetail.routes"));
// router.use("/payments",     require("./pedidos/payments.routes"));
// router.use("/shipments",    require("./pedidos/shipments.routes"));
// router.use("/returns",      require("./pedidos/returns.routes"));

// Cupones
// router.use("/coupons",      require("./cupones/coupons.routes"));
// router.use("/coupon-usage", require("./cupones/couponUsage.routes"));

// Notificaciones
// router.use("/notifications",       require("./notificaciones/notifications.routes"));
// router.use("/notification-events", require("./notificaciones/notificationEvents.routes"));

// Recomendaciones
// router.use("/recommendations",      require("./recomendaciones/recommendations.routes"));
// router.use("/recommendation-items", require("./recomendaciones/recommendationItems.routes"));

module.exports = router;