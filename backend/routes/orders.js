import express from 'express';
import { Order, User, Coupon } from '../models/models.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to calculate estimated delivery date
const getEstimatedDeliveryDate = () => {
  const days = 7; // Estimated shipping days
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// @route   POST api/orders
// @desc    Place a new order (Supports guest & user)
router.post('/', async (req, res) => {
  const {
    userId, // Can be undefined or 'guest'
    guestDetails, // { name, email, phone }
    items,
    shippingAddress,
    paymentMethod,
    couponCode,
    pointsToRedeem
  } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty.' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required.' });
    }

    // 1. Calculate subtotal
    let subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 2. Shipping Cost ($15 USD worldwide shipping, free for orders above $150 USD)
    let shippingCost = subtotal >= 150 ? 0 : 15;
    
    // 3. Coupon discount validation
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (subtotal >= coupon.minPurchase) {
          if (coupon.discountType === 'percentage') {
            discountAmount = parseFloat(((subtotal * coupon.discountValue) / 100).toFixed(2));
          } else {
            discountAmount = coupon.discountValue;
          }
        }
      }
    }

    // 4. Reward points redemption ($0.10 per point)
    let rewardPointsUsed = 0;
    let rewardDiscount = 0;
    let loggedInUser = null;

    if (userId && userId !== 'guest') {
      loggedInUser = await User.findById(userId);
      if (loggedInUser && pointsToRedeem > 0) {
        // Double check user balance
        const maxRedeemable = Math.min(loggedInUser.rewardPoints, pointsToRedeem);
        rewardPointsUsed = maxRedeemable;
        rewardDiscount = parseFloat((maxRedeemable * 0.1).toFixed(2));
      }
    }

    // 5. Compute total amount
    let totalAmount = subtotal + shippingCost - discountAmount - rewardDiscount;
    if (totalAmount < 0) totalAmount = 0;
    totalAmount = parseFloat(totalAmount.toFixed(2));

    // 6. Reward points earned for this order (1 point per $10 spent on final amount)
    let rewardPointsEarned = Math.floor(totalAmount / 10);

    // 7. Deduct/Add points if registered user
    if (loggedInUser) {
      const currentPoints = loggedInUser.rewardPoints || 0;
      const updatedPoints = currentPoints - rewardPointsUsed + rewardPointsEarned;
      await User.findByIdAndUpdate(userId, { rewardPoints: updatedPoints });
    }

    // Generate tracking ID
    const randSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `SC-TRACK-${randSuffix}`;
    const estimatedDelivery = getEstimatedDeliveryDate();

    // Create Order in DB
    const newOrder = await Order.create({
      userId: userId || 'guest',
      guestDetails: userId && userId !== 'guest' ? null : guestDetails,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'Paid', // MOCK PAYMENT SUCCESS
      shippingStatus: 'Ordered',
      shippingCost,
      discountAmount: discountAmount + rewardDiscount,
      totalAmount,
      couponUsed: couponCode || null,
      rewardPointsEarned,
      rewardPointsUsed,
      trackingNumber,
      estimatedDelivery
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error processing order.' });
  }
});

// @route   GET api/orders
// @desc    Get order history (Admin sees all; User sees theirs)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find();
    } else {
      orders = await Order.find({ userId: req.user.id });
    }
    // Sort orders from newest to oldest
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving orders.' });
  }
});

// @route   GET api/orders/:id
// @desc    Get single order details by ID or tracking number
router.get('/:id', async (req, res) => {
  try {
    // Try to search by ID first, then by tracking number
    let order = await Order.findById(req.params.id);
    if (!order) {
      order = await Order.findOne({ trackingNumber: req.params.id.toUpperCase() });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving order.' });
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order shipping status (Admin only)
router.put('/:id/status', adminMiddleware, async (req, res) => {
  const { shippingStatus } = req.body;
  const validStatusList = ['Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  try {
    if (!shippingStatus || !validStatusList.includes(shippingStatus)) {
      return res.status(400).json({ message: 'Invalid or missing shipping status.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { shippingStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating order status.' });
  }
});

export default router;
