const router = require('express').Router();
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// 1. Resumen general
router.get('/summary', async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $match: { ORD_status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$ORD_total' } } }
        ]);
        const activeOrders = await Order.countDocuments({
            ORD_status: { $in: ['pending', 'shipped', 'in_transit'] }
        });
        const totalCustomers = await User.countDocuments({ USU_role: 'cliente' });
        // Ingresos del mes actual
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyRevenue = await Order.aggregate([
            { $match: { ORD_status: 'completed', ORD_created_at: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$ORD_total' } } }
        ]);

        res.json({
            totalSales: totalSales[0]?.total || 0,
            activeOrders,
            totalCustomers,
            monthlyRevenue: monthlyRevenue[0]?.total || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Ingresos mensuales (últimos 12 meses)
router.get('/monthly-revenue', async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $match: { ORD_status: 'completed' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$ORD_created_at' },
                        month: { $month: '$ORD_created_at' }
                    },
                    total: { $sum: '$ORD_total' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Ventas por categoría
router.get('/sales-by-category', async (req, res) => {
    try {
        const result = await OrderDetail.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: 'ORD_id',
                    foreignField: 'ORD_id',
                    as: 'order'
                }
            },
            { $unwind: '$order' },
            { $match: { 'order.ORD_status': 'completed' } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'PRO_id',
                    foreignField: 'PRO_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.CAT_id',
                    total: { $sum: { $multiply: ['$DET_quantity', '$DET_unit_price'] } }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: 'CAT_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    categoryName: '$category.CAT_name',
                    total: 1
                }
            }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Pedidos recientes (con datos del usuario y pago)
router.get('/recent-orders', async (req, res) => {
    try {
        const orders = await Order.aggregate([
            { $sort: { ORD_created_at: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'USU_id',
                    foreignField: 'USU_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'ORD_id',
                    foreignField: 'ORD_id',
                    as: 'payment'
                }
            },
            { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    ORD_id: 1,
                    ORD_created_at: 1,
                    ORD_total: 1,
                    ORD_status: 1,
                    'user.USU_name': 1,
                    'payment.PAY_method': 1,
                    'payment.PAY_status': 1
                }
            }
        ]);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;