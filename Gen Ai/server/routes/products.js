const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const { isDBConnected, mockProducts } = require('../utils/dbFallback');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, collectionTag, minPrice, maxPrice, size, color, search, sort } = req.query;

    if (isDBConnected()) {
      let query = {};

      if (category) {
        query.category = category;
      }
      if (subCategory) {
        query.subCategory = subCategory;
      }
      if (collectionTag) {
        query.collectionTag = collectionTag;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (size || color) {
        query.skus = { $elemMatch: {} };
        if (size) {
          query.skus.$elemMatch.size = size;
        }
        if (color) {
          query.skus.$elemMatch.color = color;
        }
      }

      if (search) {
        query.$text = { $search: search };
      }

      let sortOption = { createdAt: -1 };
      if (sort) {
        if (sort === 'price-asc') {
          sortOption = { price: 1 };
        } else if (sort === 'price-desc') {
          sortOption = { price: -1 };
        } else if (sort === 'oldest') {
          sortOption = { createdAt: 1 };
        }
      }

      const products = await Product.find(query).sort(sortOption);
      res.json(products);
    } else {
      // In-Memory Fallback
      let result = [...mockProducts];

      if (category) {
        result = result.filter(p => p.category === category);
      }
      if (subCategory) {
        result = result.filter(p => p.subCategory === subCategory);
      }
      if (collectionTag) {
        result = result.filter(p => p.collectionTag === collectionTag);
      }
      if (minPrice) {
        result = result.filter(p => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        result = result.filter(p => p.price <= Number(maxPrice));
      }
      if (size) {
        result = result.filter(p => p.skus && p.skus.some(s => s.size === size));
      }
      if (color) {
        result = result.filter(p => 
          p.skus && p.skus.some(s => s.color.toLowerCase() === color.toLowerCase())
        );
      }
      if (search) {
        const queryStr = search.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(queryStr) || 
          p.description.toLowerCase().includes(queryStr) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(queryStr)))
        );
      }

      // Sort
      if (sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (sort === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        // default newest (by ID fallback)
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    if (isDBConnected()) {
      const product = await Product.findOne({ slug: req.params.slug });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } else {
      const product = mockProducts.find(p => p.slug === req.params.slug);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, slug, description, price, compareAtPrice, images, category, subCategory, collectionTag, skus, tags, fabricDetails, careInstructions, isFeatured } = req.body;

  try {
    if (isDBConnected()) {
      const productExists = await Product.findOne({ slug });
      if (productExists) {
        return res.status(400).json({ message: 'Product with this slug already exists' });
      }

      const product = new Product({
        name,
        slug,
        description,
        price,
        compareAtPrice,
        images,
        category,
        subCategory,
        collectionTag,
        skus,
        tags,
        fabricDetails,
        careInstructions,
        isFeatured
      });

      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } else {
      const productExists = mockProducts.some(p => p.slug === slug);
      if (productExists) {
        return res.status(400).json({ message: 'Product with this slug already exists' });
      }

      const createdProduct = {
        _id: 'mock_prod_' + Math.random().toString(36).substring(2, 9),
        name,
        slug,
        description,
        price,
        compareAtPrice,
        images,
        category,
        subCategory,
        collectionTag,
        skus,
        tags,
        fabricDetails,
        careInstructions,
        isFeatured,
        rating: 5,
        reviewCount: 0,
        createdAt: new Date()
      };

      mockProducts.push(createdProduct);
      res.status(201).json(createdProduct);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    if (isDBConnected()) {
      const product = await Product.findById(req.params.id);
      if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } else {
      const index = mockProducts.findIndex(p => p._id === req.params.id || p.id === Number(req.params.id));
      if (index !== -1) {
        mockProducts.splice(index, 1);
        res.json({ message: 'Product removed' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
