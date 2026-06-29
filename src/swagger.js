const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const param = (name, type = "number") => ({ in: "path", name, required: true, schema: { type } });

const rb = (properties) => ({
    required: true,
    content: {
        "application/json": {
            schema: { type: "object", properties }
        }
    }
});

const str = () => ({ type: "string" });
const num = () => ({ type: "number" });
const int = () => ({ type: "integer" });
const date = () => ({ type: "string", format: "date-time" });
const nullable = () => ({ type: "string", nullable: true });
const enm = (values) => ({ type: "string", enum: values });

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Modyn E-commerce API",
            version: "1.0.0",
            description: "API REST para el sistema de e-commerce Modyn con 29 colecciones"
        },
        servers: [
            { url: "http://localhost:3000", description: "Servidor local" },
            { url: "https://modyn-api.railway.app", description: "Railway" }
        ],
        tags: [
            { name: "Auth" },
            { name: "Usuarios" },
            { name: "Addresses" },
            { name: "Sessions" },
            { name: "Categories" },
            { name: "Suppliers" },
            { name: "Products" },
            { name: "Product Images" },
            { name: "Product Variants" },
            { name: "Reviews" },
            { name: "Review Images" },
            { name: "Product Likes" },
            { name: "Product QA" },
            { name: "Product Views" },
            { name: "Wishlist" },
            { name: "Wishlist Items" },
            { name: "Cart" },
            { name: "Cart Items" },
            { name: "Cart History" },
            { name: "Coupons" },
            { name: "Coupon Usage" },
            { name: "Orders" },
            { name: "Order Detail" },
            { name: "Payments" },
            { name: "Shipments" },
            { name: "Returns" },
            { name: "Notifications" },
            { name: "Notification Events" },
            { name: "Recommendations" },
            { name: "Recommendation Items" }
        ],
        paths: {

            // AUTH
            "/auth/register": {
                post: {
                    tags: ["Auth"], summary: "Registrar usuario",
                    requestBody: rb({ USU_name: str(), USU_email: str(), USU_password: str(), USU_phone: str() }),
                    responses: { 200: { description: "Usuario registrado" } }
                }
            },
            "/auth/login": {
                post: {
                    tags: ["Auth"], summary: "Iniciar sesión",
                    requestBody: rb({ USU_email: str(), USU_password: str() }),
                    responses: { 200: { description: "Token JWT generado" } }
                }
            },
            "/auth/logout": {
                post: { tags: ["Auth"], summary: "Cerrar sesión", responses: { 200: { description: "Sesión cerrada" } } }
            },
            "/auth/me": {
                get: { tags: ["Auth"], summary: "Usuario autenticado actual", responses: { 200: { description: "Datos del usuario" } } }
            },

            // USUARIOS
            "/users": {
                get: { tags: ["Usuarios"], summary: "Listar usuarios", responses: { 200: { description: "Lista de usuarios" } } },
                post: {
                    tags: ["Usuarios"], summary: "Crear usuario",
                    requestBody: rb({ USU_id: int(), USU_name: str(), USU_email: str(), USU_password: str(), USU_role: enm(["cliente", "admin"]), USU_phone: str(), USU_status: enm(["activo", "inactivo"]), USU_profile_image: nullable() }),
                    responses: { 200: { description: "Usuario creado" } }
                }
            },
            "/users/{USU_id}": {
                get: { tags: ["Usuarios"], summary: "Obtener usuario", parameters: [param("USU_id")], responses: { 200: { description: "Usuario encontrado" } } },
                put: {
                    tags: ["Usuarios"], summary: "Actualizar usuario",
                    parameters: [param("USU_id")],
                    requestBody: rb({ USU_name: str(), USU_phone: str(), USU_status: enm(["activo", "inactivo"]) }),
                    responses: { 200: { description: "Usuario actualizado" } }
                },
                delete: { tags: ["Usuarios"], summary: "Eliminar usuario", parameters: [param("USU_id")], responses: { 200: { description: "Usuario eliminado" } } }
            },

            // ADDRESSES
            "/addresses": {
                get: { tags: ["Addresses"], summary: "Listar direcciones", responses: { 200: { description: "Lista de direcciones" } } },
                post: {
                    tags: ["Addresses"], summary: "Crear dirección",
                    requestBody: rb({ ADD_id: int(), USU_id: int(), ADD_address: str(), ADD_city: str(), ADD_country: str(), ADD_zipcode: str() }),
                    responses: { 200: { description: "Dirección creada" } }
                }
            },
            "/addresses/{ADD_id}": {
                get: { tags: ["Addresses"], summary: "Obtener dirección", parameters: [param("ADD_id")], responses: { 200: { description: "Dirección encontrada" } } },
                put: {
                    tags: ["Addresses"], summary: "Actualizar dirección",
                    parameters: [param("ADD_id")],
                    requestBody: rb({ ADD_address: str(), ADD_city: str(), ADD_country: str(), ADD_zipcode: str() }),
                    responses: { 200: { description: "Dirección actualizada" } }
                },
                delete: { tags: ["Addresses"], summary: "Eliminar dirección", parameters: [param("ADD_id")], responses: { 200: { description: "Dirección eliminada" } } }
            },
            "/addresses/user/{USU_id}": {
                get: { tags: ["Addresses"], summary: "Direcciones por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Direcciones del usuario" } } }
            },

            // SESSIONS
            "/sessions": {
                get: { tags: ["Sessions"], summary: "Listar sesiones", responses: { 200: { description: "Lista de sesiones" } } },
                post: {
                    tags: ["Sessions"], summary: "Crear sesión",
                    requestBody: rb({ SES_id: int(), USU_id: int(), SES_ip_address: str(), SES_device: str(), SES_expires_at: date() }),
                    responses: { 200: { description: "Sesión creada" } }
                }
            },
            "/sessions/{SES_id}": {
                get: { tags: ["Sessions"], summary: "Obtener sesión", parameters: [param("SES_id")], responses: { 200: { description: "Sesión encontrada" } } },
                delete: { tags: ["Sessions"], summary: "Cerrar sesión", parameters: [param("SES_id")], responses: { 200: { description: "Sesión cerrada" } } }
            },
            "/sessions/user/{USU_id}": {
                get: { tags: ["Sessions"], summary: "Sesiones por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Sesiones del usuario" } } }
            },

            // CATEGORIES
            "/categories": {
                get: { tags: ["Categories"], summary: "Listar categorías", responses: { 200: { description: "Lista de categorías" } } },
                post: {
                    tags: ["Categories"], summary: "Crear categoría",
                    requestBody: rb({ CAT_id: int(), CAT_name: str(), CAT_description: str() }),
                    responses: { 200: { description: "Categoría creada" } }
                }
            },
            "/categories/{CAT_id}": {
                get: { tags: ["Categories"], summary: "Obtener categoría", parameters: [param("CAT_id")], responses: { 200: { description: "Categoría encontrada" } } },
                put: {
                    tags: ["Categories"], summary: "Actualizar categoría",
                    parameters: [param("CAT_id")],
                    requestBody: rb({ CAT_name: str(), CAT_description: str() }),
                    responses: { 200: { description: "Categoría actualizada" } }
                },
                delete: { tags: ["Categories"], summary: "Eliminar categoría", parameters: [param("CAT_id")], responses: { 200: { description: "Categoría eliminada" } } }
            },

            // SUPPLIERS
            "/suppliers": {
                get: { tags: ["Suppliers"], summary: "Listar proveedores", responses: { 200: { description: "Lista de proveedores" } } },
                post: {
                    tags: ["Suppliers"], summary: "Crear proveedor",
                    requestBody: rb({ SUP_id: int(), SUP_name: str(), SUP_contact_email: str(), SUP_phone: str() }),
                    responses: { 200: { description: "Proveedor creado" } }
                }
            },
            "/suppliers/{SUP_id}": {
                get: { tags: ["Suppliers"], summary: "Obtener proveedor", parameters: [param("SUP_id")], responses: { 200: { description: "Proveedor encontrado" } } },
                put: {
                    tags: ["Suppliers"], summary: "Actualizar proveedor",
                    parameters: [param("SUP_id")],
                    requestBody: rb({ SUP_name: str(), SUP_contact_email: str(), SUP_phone: str() }),
                    responses: { 200: { description: "Proveedor actualizado" } }
                },
                delete: { tags: ["Suppliers"], summary: "Eliminar proveedor", parameters: [param("SUP_id")], responses: { 200: { description: "Proveedor eliminado" } } }
            },

            // PRODUCTS
            "/products": {
                get: { tags: ["Products"], summary: "Listar productos", responses: { 200: { description: "Lista de productos" } } },
                post: {
                    tags: ["Products"], summary: "Crear producto",
                    requestBody: rb({ PRO_id: int(), CAT_id: int(), SUP_id: int(), PRO_name: str(), PRO_description: str(), PRO_price: num(), PRO_stock: int(), PRO_brand: str() }),
                    responses: { 200: { description: "Producto creado" } }
                }
            },
            "/products/{PRO_id}": {
                get: { tags: ["Products"], summary: "Obtener producto", parameters: [param("PRO_id")], responses: { 200: { description: "Producto encontrado" } } },
                put: {
                    tags: ["Products"], summary: "Actualizar producto",
                    parameters: [param("PRO_id")],
                    requestBody: rb({ PRO_name: str(), PRO_price: num(), PRO_stock: int() }),
                    responses: { 200: { description: "Producto actualizado" } }
                },
                delete: { tags: ["Products"], summary: "Eliminar producto", parameters: [param("PRO_id")], responses: { 200: { description: "Producto eliminado" } } }
            },
            "/products/category/{CAT_id}": {
                get: { tags: ["Products"], summary: "Productos por categoría", parameters: [param("CAT_id")], responses: { 200: { description: "Productos de la categoría" } } }
            },
            "/products/trending": {
                get: { tags: ["Products"], summary: "Top 10 productos trending", responses: { 200: { description: "Productos trending" } } }
            },

            // PRODUCT IMAGES
            "/product-images": {
                post: {
                    tags: ["Product Images"], summary: "Agregar imagen",
                    requestBody: rb({ IMG_id: int(), PRO_id: int(), IMG_url: str(), IMG_order: int() }),
                    responses: { 200: { description: "Imagen agregada" } }
                }
            },
            "/product-images/product/{PRO_id}": {
                get: { tags: ["Product Images"], summary: "Imágenes por producto", parameters: [param("PRO_id")], responses: { 200: { description: "Imágenes del producto" } } }
            },
            "/product-images/{IMG_id}": {
                delete: { tags: ["Product Images"], summary: "Eliminar imagen", parameters: [param("IMG_id")], responses: { 200: { description: "Imagen eliminada" } } }
            },

            // PRODUCT VARIANTS
            "/variants": {
                post: {
                    tags: ["Product Variants"], summary: "Crear variante",
                    requestBody: rb({ VAR_id: int(), PRO_id: int(), VAR_size: str(), VAR_color: str(), VAR_stock: int(), VAR_price: num() }),
                    responses: { 200: { description: "Variante creada" } }
                }
            },
            "/variants/product/{PRO_id}": {
                get: { tags: ["Product Variants"], summary: "Variantes por producto", parameters: [param("PRO_id")], responses: { 200: { description: "Variantes del producto" } } }
            },
            "/variants/{VAR_id}": {
                put: {
                    tags: ["Product Variants"], summary: "Actualizar variante",
                    parameters: [param("VAR_id")],
                    requestBody: rb({ VAR_stock: int(), VAR_price: num() }),
                    responses: { 200: { description: "Variante actualizada" } }
                },
                delete: { tags: ["Product Variants"], summary: "Eliminar variante", parameters: [param("VAR_id")], responses: { 200: { description: "Variante eliminada" } } }
            },

            // REVIEWS
            "/reviews": {
                post: {
                    tags: ["Reviews"], summary: "Crear reseña",
                    requestBody: rb({ REV_id: int(), PRO_id: int(), USU_id: int(), ORD_id: int(), REV_rating: int(), REV_title: str(), REV_comment: str() }),
                    responses: { 200: { description: "Reseña creada" } }
                }
            },
            "/reviews/product/{PRO_id}": {
                get: { tags: ["Reviews"], summary: "Reseñas por producto", parameters: [param("PRO_id")], responses: { 200: { description: "Reseñas del producto" } } }
            },
            "/reviews/user/{USU_id}": {
                get: { tags: ["Reviews"], summary: "Reseñas por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Reseñas del usuario" } } }
            },
            "/reviews/{REV_id}": {
                put: {
                    tags: ["Reviews"], summary: "Actualizar reseña",
                    parameters: [param("REV_id")],
                    requestBody: rb({ REV_rating: int(), REV_comment: str() }),
                    responses: { 200: { description: "Reseña actualizada" } }
                },
                delete: { tags: ["Reviews"], summary: "Eliminar reseña", parameters: [param("REV_id")], responses: { 200: { description: "Reseña eliminada" } } }
            },

            // REVIEW IMAGES
            "/review-images": {
                post: {
                    tags: ["Review Images"], summary: "Agregar imagen a reseña",
                    requestBody: rb({ REVIMG_id: int(), REV_id: int(), REVIMG_url: str() }),
                    responses: { 200: { description: "Imagen agregada" } }
                }
            },
            "/review-images/review/{REV_id}": {
                get: { tags: ["Review Images"], summary: "Imágenes por reseña", parameters: [param("REV_id")], responses: { 200: { description: "Imágenes de la reseña" } } }
            },
            "/review-images/{REVIMG_id}": {
                delete: { tags: ["Review Images"], summary: "Eliminar imagen de reseña", parameters: [param("REVIMG_id")], responses: { 200: { description: "Imagen eliminada" } } }
            },

            // PRODUCT LIKES
            "/likes": {
                post: {
                    tags: ["Product Likes"], summary: "Dar like",
                    requestBody: rb({ PLK_id: int(), PRO_id: int(), USU_id: int() }),
                    responses: { 200: { description: "Like registrado" } }
                }
            },
            "/likes/product/{PRO_id}": {
                get: { tags: ["Product Likes"], summary: "Likes por producto", parameters: [param("PRO_id")], responses: { 200: { description: "Likes del producto" } } }
            },
            "/likes/user/{USU_id}": {
                get: { tags: ["Product Likes"], summary: "Likes por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Likes del usuario" } } }
            },
            "/likes/{PLK_id}": {
                delete: { tags: ["Product Likes"], summary: "Quitar like", parameters: [param("PLK_id")], responses: { 200: { description: "Like eliminado" } } }
            },

            // PRODUCT QA
            "/qa": {
                post: {
                    tags: ["Product QA"], summary: "Crear pregunta",
                    requestBody: rb({ QA_id: int(), PRO_id: int(), USU_id: int(), QA_question: str(), QA_answer: str() }),
                    responses: { 200: { description: "Pregunta creada" } }
                }
            },
            "/qa/product/{PRO_id}": {
                get: { tags: ["Product QA"], summary: "Q&A por producto", parameters: [param("PRO_id")], responses: { 200: { description: "Preguntas del producto" } } }
            },
            "/qa/{QA_id}": {
                put: {
                    tags: ["Product QA"], summary: "Actualizar Q&A",
                    parameters: [param("QA_id")],
                    requestBody: rb({ QA_answer: str() }),
                    responses: { 200: { description: "Q&A actualizado" } }
                },
                delete: { tags: ["Product QA"], summary: "Eliminar Q&A", parameters: [param("QA_id")], responses: { 200: { description: "Q&A eliminado" } } }
            },

            // PRODUCT VIEWS
            "/views": {
                post: {
                    tags: ["Product Views"], summary: "Registrar vista",
                    requestBody: rb({ VIEW_id: int(), PRO_id: int(), USU_id: int() }),
                    responses: { 200: { description: "Vista registrada" } }
                }
            },
            "/views/product/{PRO_id}": {
                get: { tags: ["Product Views"], summary: "Vistas por producto", parameters: [param("PRO_id")], responses: { 200: { description: "Vistas del producto" } } }
            },

            // WISHLIST
            "/wishlist": {
                get: { tags: ["Wishlist"], summary: "Listar wishlists", responses: { 200: { description: "Lista de wishlists" } } },
                post: {
                    tags: ["Wishlist"], summary: "Crear wishlist",
                    requestBody: rb({ WIS_id: int(), USU_id: int() }),
                    responses: { 200: { description: "Wishlist creada" } }
                }
            },
            "/wishlist/user/{USU_id}": {
                get: { tags: ["Wishlist"], summary: "Wishlist por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Wishlist del usuario" } } }
            },
            "/wishlist/{WIS_id}": {
                get: { tags: ["Wishlist"], summary: "Obtener wishlist", parameters: [param("WIS_id")], responses: { 200: { description: "Wishlist encontrada" } } },
                delete: { tags: ["Wishlist"], summary: "Eliminar wishlist", parameters: [param("WIS_id")], responses: { 200: { description: "Wishlist eliminada" } } }
            },

            // WISHLIST ITEMS
            "/wishlist-items": {
                get: { tags: ["Wishlist Items"], summary: "Listar items", responses: { 200: { description: "Lista de items" } } },
                post: {
                    tags: ["Wishlist Items"], summary: "Agregar item",
                    requestBody: rb({ WIST_id: int(), WIS_id: int(), PRO_id: int() }),
                    responses: { 200: { description: "Item agregado" } }
                }
            },
            "/wishlist-items/wishlist/{WIS_id}": {
                get: { tags: ["Wishlist Items"], summary: "Items por wishlist", parameters: [param("WIS_id")], responses: { 200: { description: "Items de la wishlist" } } }
            },
            "/wishlist-items/{WIST_id}": {
                delete: { tags: ["Wishlist Items"], summary: "Quitar item", parameters: [param("WIST_id")], responses: { 200: { description: "Item eliminado" } } }
            },

            // CART
            "/cart": {
                get: { tags: ["Cart"], summary: "Listar carritos", responses: { 200: { description: "Lista de carritos" } } },
                post: {
                    tags: ["Cart"], summary: "Crear carrito",
                    requestBody: rb({ CAR_id: int(), USU_id: int() }),
                    responses: { 200: { description: "Carrito creado" } }
                }
            },
            "/cart/user/{USU_id}": {
                get: { tags: ["Cart"], summary: "Carrito por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Carrito del usuario" } } }
            },
            "/cart/{CAR_id}": {
                get: { tags: ["Cart"], summary: "Obtener carrito", parameters: [param("CAR_id")], responses: { 200: { description: "Carrito encontrado" } } },
                delete: { tags: ["Cart"], summary: "Eliminar carrito", parameters: [param("CAR_id")], responses: { 200: { description: "Carrito eliminado" } } }
            },

            // CART ITEMS
            "/cart-items": {
                get: { tags: ["Cart Items"], summary: "Listar items del carrito", responses: { 200: { description: "Lista de items" } } },
                post: {
                    tags: ["Cart Items"], summary: "Agregar al carrito",
                    requestBody: rb({ CARTI_id: int(), CAR_id: int(), PRO_id: int(), CARTI_quantity: int(), CARTI_price: num() }),
                    responses: { 200: { description: "Producto agregado" } }
                }
            },
            "/cart-items/cart/{CAR_id}": {
                get: { tags: ["Cart Items"], summary: "Items por carrito", parameters: [param("CAR_id")], responses: { 200: { description: "Items del carrito" } } }
            },
            "/cart-items/{CARTI_id}": {
                put: {
                    tags: ["Cart Items"], summary: "Actualizar cantidad",
                    parameters: [param("CARTI_id")],
                    requestBody: rb({ CARTI_quantity: int() }),
                    responses: { 200: { description: "Cantidad actualizada" } }
                },
                delete: { tags: ["Cart Items"], summary: "Quitar del carrito", parameters: [param("CARTI_id")], responses: { 200: { description: "Producto eliminado" } } }
            },

            // CART HISTORY
            "/cart-history": {
                get: { tags: ["Cart History"], summary: "Listar historial", responses: { 200: { description: "Lista de historial" } } },
                post: {
                    tags: ["Cart History"], summary: "Registrar acción",
                    requestBody: rb({ CHS_id: int(), CAR_id: int(), PRO_id: int(), CHS_action: enm(["added", "removed"]) }),
                    responses: { 200: { description: "Acción registrada" } }
                }
            },
            "/cart-history/cart/{CAR_id}": {
                get: { tags: ["Cart History"], summary: "Historial por carrito", parameters: [param("CAR_id")], responses: { 200: { description: "Historial del carrito" } } }
            },

            // COUPONS
            "/coupons": {
                get: { tags: ["Coupons"], summary: "Listar cupones", responses: { 200: { description: "Lista de cupones" } } },
                post: {
                    tags: ["Coupons"], summary: "Crear cupón",
                    requestBody: rb({ COU_id: int(), COU_code: str(), COU_discount_type: enm(["percentage", "fixed"]), COU_discount_value: num(), COU_min_purchase: num(), COU_expires_at: date() }),
                    responses: { 200: { description: "Cupón creado" } }
                }
            },
            "/coupons/{COU_id}": {
                get: { tags: ["Coupons"], summary: "Obtener cupón", parameters: [param("COU_id")], responses: { 200: { description: "Cupón encontrado" } } },
                put: {
                    tags: ["Coupons"], summary: "Actualizar cupón",
                    parameters: [param("COU_id")],
                    requestBody: rb({ COU_discount_value: num(), COU_expires_at: date() }),
                    responses: { 200: { description: "Cupón actualizado" } }
                },
                delete: { tags: ["Coupons"], summary: "Eliminar cupón", parameters: [param("COU_id")], responses: { 200: { description: "Cupón eliminado" } } }
            },
            "/coupons/code/{COU_code}": {
                get: { tags: ["Coupons"], summary: "Cupón por código", parameters: [param("COU_code", "string")], responses: { 200: { description: "Cupón encontrado" } } }
            },

            // COUPON USAGE
            "/coupon-usage": {
                post: {
                    tags: ["Coupon Usage"], summary: "Registrar uso de cupón",
                    requestBody: rb({ CPU_id: int(), COU_id: int(), USU_id: int(), ORD_id: int() }),
                    responses: { 200: { description: "Uso registrado" } }
                }
            },
            "/coupon-usage/coupon/{COU_id}": {
                get: { tags: ["Coupon Usage"], summary: "Usos por cupón", parameters: [param("COU_id")], responses: { 200: { description: "Usos del cupón" } } }
            },
            "/coupon-usage/user/{USU_id}": {
                get: { tags: ["Coupon Usage"], summary: "Cupones por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Cupones del usuario" } } }
            },

            // ORDERS
            "/orders": {
                get: { tags: ["Orders"], summary: "Listar pedidos", responses: { 200: { description: "Lista de pedidos" } } },
                post: {
                    tags: ["Orders"], summary: "Crear pedido",
                    requestBody: rb({ ORD_id: int(), USU_id: int(), COU_id: nullable(), ORD_total: num(), ORD_status: enm(["pending", "shipped", "completed", "cancelled"]) }),
                    responses: { 200: { description: "Pedido creado" } }
                }
            },
            "/orders/{ORD_id}": {
                get: { tags: ["Orders"], summary: "Obtener pedido", parameters: [param("ORD_id")], responses: { 200: { description: "Pedido encontrado" } } },
                put: {
                    tags: ["Orders"], summary: "Actualizar estado",
                    parameters: [param("ORD_id")],
                    requestBody: rb({ ORD_status: enm(["pending", "shipped", "completed", "cancelled"]) }),
                    responses: { 200: { description: "Pedido actualizado" } }
                },
                delete: { tags: ["Orders"], summary: "Cancelar pedido", parameters: [param("ORD_id")], responses: { 200: { description: "Pedido cancelado" } } }
            },
            "/orders/user/{USU_id}": {
                get: { tags: ["Orders"], summary: "Pedidos por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Pedidos del usuario" } } }
            },

            // ORDER DETAIL
            "/order-detail": {
                post: {
                    tags: ["Order Detail"], summary: "Agregar detalle",
                    requestBody: rb({ DET_id: int(), ORD_id: int(), PRO_id: int(), DET_quantity: int(), DET_unit_price: num() }),
                    responses: { 200: { description: "Detalle agregado" } }
                }
            },
            "/order-detail/order/{ORD_id}": {
                get: { tags: ["Order Detail"], summary: "Detalle por pedido", parameters: [param("ORD_id")], responses: { 200: { description: "Detalle del pedido" } } }
            },
            "/order-detail/{DET_id}": {
                delete: { tags: ["Order Detail"], summary: "Eliminar detalle", parameters: [param("DET_id")], responses: { 200: { description: "Detalle eliminado" } } }
            },

            // PAYMENTS
            "/payments": {
                get: { tags: ["Payments"], summary: "Listar pagos", responses: { 200: { description: "Lista de pagos" } } },
                post: {
                    tags: ["Payments"], summary: "Registrar pago",
                    requestBody: rb({ PAY_id: int(), ORD_id: int(), PAY_method: enm(["Tarjeta", "Yape", "Plin"]), PAY_amount: num(), PAY_status: enm(["pending", "completed", "refunded"]), PAY_paid_at: date() }),
                    responses: { 200: { description: "Pago registrado" } }
                }
            },
            "/payments/{PAY_id}": {
                put: {
                    tags: ["Payments"], summary: "Actualizar estado de pago",
                    parameters: [param("PAY_id")],
                    requestBody: rb({ PAY_status: enm(["pending", "completed", "refunded"]) }),
                    responses: { 200: { description: "Pago actualizado" } }
                }
            },
            "/payments/order/{ORD_id}": {
                get: { tags: ["Payments"], summary: "Pago por pedido", parameters: [param("ORD_id")], responses: { 200: { description: "Pago del pedido" } } }
            },

            // SHIPMENTS
            "/shipments": {
                get: { tags: ["Shipments"], summary: "Listar envíos", responses: { 200: { description: "Lista de envíos" } } },
                post: {
                    tags: ["Shipments"], summary: "Crear envío",
                    requestBody: rb({ SHI_id: int(), ORD_id: int(), ADD_id: int(), SHI_carrier: str(), SHI_tracking_number: str(), SHI_status: enm(["shipped", "in_transit", "delivered", "returned"]), SHI_estimated_at: date() }),
                    responses: { 200: { description: "Envío creado" } }
                }
            },
            "/shipments/{SHI_id}": {
                put: {
                    tags: ["Shipments"], summary: "Actualizar estado de envío",
                    parameters: [param("SHI_id")],
                    requestBody: rb({ SHI_status: enm(["shipped", "in_transit", "delivered", "returned"]) }),
                    responses: { 200: { description: "Envío actualizado" } }
                }
            },
            "/shipments/order/{ORD_id}": {
                get: { tags: ["Shipments"], summary: "Envío por pedido", parameters: [param("ORD_id")], responses: { 200: { description: "Envío del pedido" } } }
            },

            // RETURNS
            "/returns": {
                get: { tags: ["Returns"], summary: "Listar devoluciones", responses: { 200: { description: "Lista de devoluciones" } } },
                post: {
                    tags: ["Returns"], summary: "Crear devolución",
                    requestBody: rb({ RET_id: int(), ORD_id: int(), RET_reason: str(), RET_status: enm(["pending", "approved", "rejected"]), RET_refund_amount: num() }),
                    responses: { 200: { description: "Devolución creada" } }
                }
            },
            "/returns/{RET_id}": {
                put: {
                    tags: ["Returns"], summary: "Actualizar estado de devolución",
                    parameters: [param("RET_id")],
                    requestBody: rb({ RET_status: enm(["pending", "approved", "rejected"]) }),
                    responses: { 200: { description: "Devolución actualizada" } }
                }
            },
            "/returns/order/{ORD_id}": {
                get: { tags: ["Returns"], summary: "Devolución por pedido", parameters: [param("ORD_id")], responses: { 200: { description: "Devolución del pedido" } } }
            },

            // NOTIFICATIONS
            "/notifications": {
                post: {
                    tags: ["Notifications"], summary: "Crear notificación",
                    requestBody: rb({ NOT_id: int(), USU_id: int(), NOT_type: enm(["order", "promo", "shipment", "return", "review", "wishlist", "system"]), NOT_message: str(), NOT_read_at: nullable() }),
                    responses: { 200: { description: "Notificación creada" } }
                }
            },
            "/notifications/{NOT_id}": {
                get: { tags: ["Notifications"], summary: "Obtener notificación", parameters: [param("NOT_id")], responses: { 200: { description: "Notificación encontrada" } } },
                put: {
                    tags: ["Notifications"], summary: "Marcar como leída",
                    parameters: [param("NOT_id")],
                    requestBody: rb({ NOT_read_at: date() }),
                    responses: { 200: { description: "Notificación actualizada" } }
                },
                delete: { tags: ["Notifications"], summary: "Eliminar notificación", parameters: [param("NOT_id")], responses: { 200: { description: "Notificación eliminada" } } }
            },
            "/notifications/user/{USU_id}": {
                get: { tags: ["Notifications"], summary: "Notificaciones por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Notificaciones del usuario" } } }
            },

            // NOTIFICATION EVENTS
            "/notification-events": {
                post: {
                    tags: ["Notification Events"], summary: "Crear evento",
                    requestBody: rb({ NEV_id: int(), NOT_id: int(), ORD_id: nullable(), SHI_id: nullable(), COU_id: nullable() }),
                    responses: { 200: { description: "Evento creado" } }
                }
            },
            "/notification-events/{NEV_id}": {
                get: { tags: ["Notification Events"], summary: "Obtener evento", parameters: [param("NEV_id")], responses: { 200: { description: "Evento encontrado" } } }
            },
            "/notification-events/notification/{NOT_id}": {
                get: { tags: ["Notification Events"], summary: "Eventos por notificación", parameters: [param("NOT_id")], responses: { 200: { description: "Eventos de la notificación" } } }
            },

            // RECOMMENDATIONS
            "/recommendations": {
                post: {
                    tags: ["Recommendations"], summary: "Crear recomendación",
                    requestBody: rb({ REC_id: int(), USU_id: int(), REC_generated_at: date(), REC_expires_at: date() }),
                    responses: { 200: { description: "Recomendación creada" } }
                }
            },
            "/recommendations/{REC_id}": {
                get: { tags: ["Recommendations"], summary: "Obtener recomendación", parameters: [param("REC_id")], responses: { 200: { description: "Recomendación encontrada" } } },
                delete: { tags: ["Recommendations"], summary: "Eliminar recomendación", parameters: [param("REC_id")], responses: { 200: { description: "Recomendación eliminada" } } }
            },
            "/recommendations/user/{USU_id}": {
                get: { tags: ["Recommendations"], summary: "Recomendaciones por usuario", parameters: [param("USU_id")], responses: { 200: { description: "Recomendaciones del usuario" } } }
            },

            // RECOMMENDATION ITEMS
            "/recommendation-items": {
                post: {
                    tags: ["Recommendation Items"], summary: "Agregar item",
                    requestBody: rb({ RIT_id: int(), REC_id: int(), PRO_id: int(), RIT_score: num(), RIT_reason: str() }),
                    responses: { 200: { description: "Item agregado" } }
                }
            },
            "/recommendation-items/{RIT_id}": {
                get: { tags: ["Recommendation Items"], summary: "Obtener item", parameters: [param("RIT_id")], responses: { 200: { description: "Item encontrado" } } },
                delete: { tags: ["Recommendation Items"], summary: "Eliminar item", parameters: [param("RIT_id")], responses: { 200: { description: "Item eliminado" } } }
            },
            "/recommendation-items/rec/{REC_id}": {
                get: { tags: ["Recommendation Items"], summary: "Items por recomendación", parameters: [param("REC_id")], responses: { 200: { description: "Items de la recomendación" } } }
            }
        }
    },
    apis: []
};

const specs = swaggerJsdoc(options);
module.exports = { swaggerUi, specs };