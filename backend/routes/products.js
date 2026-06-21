import express from 'express';
import { Product, Review } from '../models/models.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/products
// @desc    Get filtered products list
router.get('/', async (req, res) => {
  try {
    let products = await Product.find();
    const { category, search, minPrice, maxPrice, sort, featured, isBestSeller, isNewArrival } = req.query;

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured === true);
    }

    if (isBestSeller === 'true') {
      products = products.filter(p => p.isBestSeller === true);
    }

    if (isNewArrival === 'true') {
      products = products.filter(p => p.isNewArrival === true);
    }

    if (sort) {
      if (sort === 'price_asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving products.' });
  }
});

// @route   GET api/products/:id
// @desc    Get single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    
    // Fetch associated reviews
    const reviews = await Review.find({ productId: req.params.id });
    
    res.json({
      ...product,
      reviews: reviews || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching product.' });
  }
});

// @route   POST api/products/:id/reviews
// @desc    Add review for a product
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  const { rating, comment, userName } = req.body;
  const productId = req.params.id;

  try {
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and review comment are required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Create review
    const newReview = await Review.create({
      productId,
      userName: userName || 'Anonymous Customer',
      rating: parseInt(rating),
      comment,
      helpfulVotes: 0
    });

    // Update product rating stats
    const allReviews = await Review.find({ productId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRating / allReviews.length).toFixed(1));

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewsCount: allReviews.length
    });

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding review.' });
  }
});

// @route   POST api/products
// @desc    Add a product (Admin only)
router.post('/', adminMiddleware, async (req, res) => {
  const { name, description, price, category, stock, images, videoUrl, specifications, tags, featured, isBestSeller, isNewArrival } = req.body;

  try {
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Please supply name, description, price, and category.' });
    }

    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: stock ? parseInt(stock) : 10,
      status: stock && parseInt(stock) > 0 ? 'In Stock' : 'Out of Stock',
      images: images || [],
      videoUrl: videoUrl || '',
      specifications: specifications || {},
      tags: tags || [],
      featured: featured || false,
      isBestSeller: isBestSeller || false,
      isNewArrival: isNewArrival || false,
      rating: 5,
      reviewsCount: 0
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating product.' });
  }
});

// @route   PUT api/products/:id
// @desc    Update a product (Admin only)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { stock } = req.body;
    const updateFields = { ...req.body };
    
    if (stock !== undefined) {
      updateFields.status = parseInt(stock) > 0 ? 'In Stock' : 'Out of Stock';
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating product.' });
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product (Admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    
    // Also delete product reviews
    await Review.deleteOne({ productId: req.params.id });

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting product.' });
  }
});

export default router;
