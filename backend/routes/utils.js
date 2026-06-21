import express from 'express';
import { Coupon } from '../models/models.js';

const router = express.Router();

// Mock Newsletter Emails list (in-memory, or saved in server.log)
const newsletterSubscribers = [];

// @route   POST api/utils/newsletter
// @desc    Subscribe to newsletter
router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (newsletterSubscribers.includes(email.toLowerCase())) {
    return res.status(400).json({ message: 'This email is already subscribed.' });
  }

  newsletterSubscribers.push(email.toLowerCase());
  console.log(`[NEWSLETTER SUBSCRIBE] Email: ${email}`);
  
  res.status(200).json({ message: 'Thank you for subscribing to Shekhawati Collection! Your 10% coupon code is WELCOME10.' });
});

// @route   GET api/utils/exchange-rates
// @desc    Get mock exchange rates relative to USD (base currency)
router.get('/exchange-rates', (req, res) => {
  // Hardcoded premium rates for regional currencies
  res.json({
    base: 'USD',
    rates: {
      USD: 1.00,
      GBP: 0.79,
      EUR: 0.92,
      CAD: 1.37,
      AUD: 1.50
    }
  });
});

// @route   GET api/utils/coupons/:code
// @desc    Validate a promo code
router.get('/coupons/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();
  try {
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon code is invalid or expired.' });
    }
    res.json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error checking coupon.' });
  }
});

// @route   POST api/utils/chat
// @desc    Live Chat interaction responder
router.post('/chat', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message content cannot be blank.' });
  }

  const query = message.toLowerCase();
  let response = "";

  if (query.includes('shipping') || query.includes('delivery') || query.includes('track')) {
    response = "We offer free global shipping on all orders over $150 USD. Orders destined for the USA, UK, Europe, Canada, and Australia typically arrive within 5-7 business days. You can track your order using the 'Track Order' tool on our website with your Order ID or tracking code.";
  } else if (query.includes('return') || query.includes('refund') || query.includes('exchange')) {
    response = "Shekhawati Collection is committed to premium satisfaction. We accept returns of unused items in original packaging within 30 days of delivery. Please email us at shekhawaticollection@gmail.com to initiate your easy return process.";
  } else if (query.includes('jewellery') || query.includes('jewelry') || query.includes('necklace') || query.includes('ring')) {
    response = "Our Artificial Jewellery catalog features exquisite premium hand-crafted royal sets, rings, and earrings decorated with high-quality gold plating and traditional Rajasthani design accents.";
  } else if (query.includes('wooden') || query.includes('furniture') || query.includes('handicraft')) {
    response = "Our Wooden Items are hand-carved by master artisans in Shekhawati (Rajasthan) using seasoned premium Sheesham and mango wood. Every piece is polished to perfection and fully inspected.";
  } else if (query.includes('herbal') || query.includes('skin') || query.includes('health')) {
    response = "Our Herbal Products are made from 100% natural organic extracts, conforming to global safety regulations. They are perfect for revitalizing skincare and daily organic wellness routines.";
  } else if (query.includes('suit') || query.includes('ladies') || query.includes('dress') || query.includes('fabric')) {
    response = "Our Ladies Suits feature authentic handloom fabrics, delicate zari borders, and custom royal embroidery. We offer sizing details on individual product listings.";
  } else if (query.includes('contact') || query.includes('phone') || query.includes('call') || query.includes('support')) {
    response = "You can contact our premium 24/7 client relations desk at +91 7732983203 or email us at shekhawaticollection@gmail.com. We are always happy to help!";
  } else if (query.includes('coupon') || query.includes('discount') || query.includes('promo')) {
    response = "You can use coupon code WELCOME10 for an immediate 10% discount on your first order. Enter it at the checkout page!";
  } else {
    response = "Thank you for contacting Shekhawati Collection Client Relations. How may I assist you today with our luxury Wooden Items, Artificial Jewellery, Herbal Products, or Ladies Suits?";
  }

  res.json({ reply: response });
});

export default router;
