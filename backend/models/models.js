import mongoose from 'mongoose';
import { LocalModel } from './LocalModel.js';

// Define Mongoose schemas for when we are using MongoDB
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  rewardPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 10 },
  status: { type: String, default: 'In Stock' },
  images: [String],
  videoUrl: String,
  specifications: mongoose.Schema.Types.Mixed,
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  tags: [String],
  featured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: String, // String representation of user ID or 'Guest'
  guestDetails: mongoose.Schema.Types.Mixed,
  items: Array,
  shippingAddress: mongoose.Schema.Types.Mixed,
  paymentMethod: String,
  paymentStatus: { type: String, default: 'Pending' },
  shippingStatus: { type: String, default: 'Ordered' },
  shippingCost: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  couponUsed: String,
  rewardPointsEarned: { type: Number, default: 0 },
  rewardPointsUsed: { type: Number, default: 0 },
  trackingNumber: String,
  estimatedDelivery: String,
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  helpfulVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, required: true },
  discountValue: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

let User, Product, Order, Review, Coupon;

// Helper to determine if we are in MongoDB mode
const useMongo = () => {
  return !!process.env.MONGODB_URI;
};

if (useMongo()) {
  User = mongoose.models.User || mongoose.model('User', userSchema);
  Product = mongoose.models.Product || mongoose.model('Product', productSchema);
  Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
  Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
  Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
} else {
  User = new LocalModel('users');
  Product = new LocalModel('products');
  Order = new LocalModel('orders');
  Review = new LocalModel('reviews');
  Coupon = new LocalModel('coupons');
}

export { User, Product, Order, Review, Coupon };
export { useMongo };
