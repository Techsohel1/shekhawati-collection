import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, isMongo } from './config/db.js';
import { Product, Coupon, User, Review } from './models/models.js';

dotenv.config();

const seedProducts = [
  // WOODEN ITEMS
  {
    name: "Royal Hand-Carved Sheesham Wood Trunk",
    price: 289.00,
    description: "A magnificent royal chest handcrafted from premium seasoned Sheesham wood. Featuring traditional brass metal floral inlays, intricate geometric hand carvings, and a secure lockable latch, this piece is an artisan masterpiece that serves as a beautiful accent chest or storage trunk.",
    category: "Wooden Items",
    stock: 6,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800",
      "https://images.unsplash.com/photo-1595428774754-07321f985390?q=80&w=800"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Mock product video
    specifications: {
      "Material": "Seasoned Sheesham Wood (Indian Rosewood)",
      "Metal Accents": "Brass Floral Inlays",
      "Dimensions": "36 x 18 x 18 inches",
      "Weight": "22.5 kg",
      "Origin": "Shekhawati, Rajasthan"
    },
    rating: 4.8,
    reviewsCount: 3,
    tags: ["wooden", "furniture", "trunk", "royal", "handcrafted"],
    featured: true,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    name: "Artisanal Wooden Jharokha Wall Mirror Frame",
    price: 120.00,
    description: "Imbue your walls with authentic Rajasthani heritage. This traditional Jharokha arched window frame is hand-carved from seasoned mango wood with distressed ivory and royal gold gold-leaf polish. Fits a central mirror sheet to reflect regal elegance in your home.",
    category: "Wooden Items",
    stock: 8,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Material": "Premium Mango Wood",
      "Dimensions": "24 x 16 x 2 inches",
      "Weight": "4.2 kg",
      "Polish Type": "Distressed Royal Gold & Ivory Leaf Finish",
      "Mounting": "Wall Mount Hangers Included"
    },
    rating: 4.9,
    reviewsCount: 2,
    tags: ["wooden", "mirror", "jharokha", "wall-decor", "carving"],
    featured: true,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    name: "Handcrafted Rosewood Lattice-Cut Elephant Figurine",
    price: 75.00,
    description: "A beautiful decorative sculpture of a royal elephant with an open-work lattice (Jali) carving. Carved from a single block of premium Indian Rosewood, this figurine symbolizes wisdom, strength, and prosperity. Inside the outer elephant, a tiny baby elephant is carved, showing superb craftsmanship.",
    category: "Wooden Items",
    stock: 15,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Material": "Indian Rosewood (Sonokeling)",
      "Carving Technique": "Single-Block Under-Carved Lattice (Jali) Work",
      "Dimensions": "8 x 6 x 4 inches",
      "Weight": "1.1 kg",
      "Finish": "Natural Beeswax Polish"
    },
    rating: 4.7,
    reviewsCount: 1,
    tags: ["wooden", "figurine", "elephant", "decor", "gift"],
    featured: false,
    isBestSeller: false,
    isNewArrival: true
  },

  // ARTIFICIAL JEWELLERY
  {
    name: "Kundan Royal Gold Plated Choker Necklace Set",
    price: 180.00,
    description: "An exquisite royal choker set adorned with premium white Kundan stones, fine hand-painted Meenakari (enameling) work on the reverse side, and elegant green bead drops. Includes a matching pair of dangling royal Jhumka earrings.",
    category: "Artificial Jewellery",
    stock: 10,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    specifications: {
      "Base Metal": "Copper-Brass Hypoallergenic Alloy",
      "Plating": "24k Antique Gold Plating",
      "Gemstones": "AAA Grade Kundan Stones, Faux Emerald Beads",
      "Included items": "1 Choker Necklace, 2 Dangling Earrings",
      "Clasp Type": "Adjustable Drawstring Cord (Dori)"
    },
    rating: 4.9,
    reviewsCount: 4,
    tags: ["jewellery", "kundan", "necklace", "gold-plated", "wedding", "choker"],
    featured: true,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    name: "Traditional Rajasthani Borla Maang Tikka",
    price: 45.00,
    description: "A classic spherical Borla maang tikka, custom crafted with red and white ruby stones and detailed gold beadwork. Traditionally worn on the hairline to project royal Rajasthani heritage. Features a secure hair hook.",
    category: "Artificial Jewellery",
    stock: 20,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Base Metal": "Alloy",
      "Plating": "22k Gold Tint Plating",
      "Gemstones": "Synthetic Rubies & Pearl Beads",
      "Dimensions": "2.5 cm diameter Borla head",
      "Weight": "18 grams"
    },
    rating: 4.6,
    reviewsCount: 1,
    tags: ["jewellery", "borla", "maang-tikka", "headwear", "ethnic"],
    featured: false,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    name: "Premium Gold-Plated Peacock Kada Bangles (Pair)",
    price: 90.00,
    description: "A gorgeous pair of premium openable Kada bangles featuring beautifully detailed peacock figures facing each other. Adorned with micro-pave red spinels and white crystals, finished with 22k yellow gold plating. Standard push-latch clasp.",
    category: "Artificial Jewellery",
    stock: 8,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Base Metal": "Copper-Brass Alloy",
      "Plating": "22k Micro-Gold Plating",
      "Size": "2.6 (Fits sizes 2.4 to 2.8 due to openable lock)",
      "Included": "Set of 2 Kada Bangles",
      "Clasp": "Screw-Pin Lock"
    },
    rating: 4.8,
    reviewsCount: 2,
    tags: ["jewellery", "bangles", "kada", "peacock", "gold-plated"],
    featured: true,
    isBestSeller: true,
    isNewArrival: false
  },

  // HERBAL PRODUCTS
  {
    name: "Royal Sandalwood & Saffron Skin Radiance Elixir",
    price: 35.00,
    description: "An ancient facial beauty serum made of authentic Mysore Sandalwood Oil and Kashmiri Kumkumadi Saffron. Formulated to reduce dark spots, enrich skin texture, and restore a royal gold-like radiant glow. 100% natural formula.",
    category: "Herbal Products",
    stock: 30,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=800",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Volume": "30 ml / 1.0 fl.oz",
      "Key Ingredients": "Pure Saffron Stigmas, Mysore Sandalwood Oil, Cold-Pressed Almond Oil, Vetiver",
      "Skin Type Suitability": "All Skin Types (Acne-prone to dry)",
      "Organic Standard": "100% Organic & Preservative-Free",
      "Directions": "Apply 3-4 drops nightly on cleansed skin"
    },
    rating: 4.9,
    reviewsCount: 5,
    tags: ["herbal", "serum", "sandalwood", "saffron", "skincare", "glow"],
    featured: true,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    name: "Organic Neem & Tulsi Purifying Clay Face Pack",
    price: 22.00,
    description: "A detoxifying clay mask infused with organic sun-dried Neem and Holy Basil (Tulsi) leaves. Cleanses deep pores, combats skin congestion, and cools the skin using traditional Ayurvedic remedies. Removes excess oils without drying.",
    category: "Herbal Products",
    stock: 40,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Weight": "100 grams / 3.5 oz",
      "Form": "Dry Powder Clay Mask",
      "Ingredients": "Active Neem Leaves, Tulsi Powder, Multani Mitti (Fuller's Earth), Turmeric Root",
      "Chemical Exclusions": "Zero Parabens, Zero Sulphates, No Artificial Colors"
    },
    rating: 4.7,
    reviewsCount: 2,
    tags: ["herbal", "face-pack", "neem", "tulsi", "ayurvedic", "clay-mask"],
    featured: false,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    name: "Luxurious Kesh Kanti Herbal Hair Nourishment Oil",
    price: 28.00,
    description: "An intensive hair therapy oil brewed with Bhringraj, Amla, Brahmi, and Cold-Pressed Coconut Oil. Promotes healthy root growth, prevents premature graying, and gives hair a natural, silky deep shine. Gently massaged on scalp twice a week.",
    category: "Herbal Products",
    stock: 25,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Volume": "200 ml / 6.7 fl.oz",
      "Primary Extracts": "Bhringraj (Eclipta Alba), Amla (Indian Gooseberry), Brahmi (Bacopa Monnieri)",
      "Base Oils": "Cold-Pressed Sesame Oil & Extra Virgin Coconut Oil",
      "Nourishment Target": "Hair Fall Control & Scalp Hydration"
    },
    rating: 4.8,
    reviewsCount: 3,
    tags: ["herbal", "hair-oil", "haircare", "ayurvedic", "shampoo-prep"],
    featured: false,
    isBestSeller: true,
    isNewArrival: false
  },

  // LADIES SUITS
  {
    name: "Royal Maroon Embroidered Silk Anarkali Suit",
    price: 210.00,
    description: "A breathtaking royal maroon suit with a floor-length flared Anarkali silhouette. Elaborately embroidered with golden zari, sequins, and threadwork. Comes with matching silk churidar pants and a sheer golden organza dupatta.",
    category: "Ladies Suits",
    stock: 5,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800",
      "https://images.unsplash.com/photo-1583391265517-35bbdad01209?q=80&w=800"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    specifications: {
      "Suit Fabric": "Premium Raw Art Silk",
      "Dupatta Fabric": "Semi-Transparent Organza with Golden Gota Lace",
      "Embellishments": "Antique Gold Zari & Sequins Gota Embroidery",
      "Fit": "Flared Anarkali Silhouette",
      "Sizes Available": "S, M, L, XL, XXL (Stitched Set)"
    },
    rating: 4.9,
    reviewsCount: 4,
    tags: ["suit", "anarkali", "maroon", "embroidery", "silk", "ethnic-wear"],
    featured: true,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    name: "Classic Jaipuri Handblock Printed Cotton Salwar Suit",
    price: 110.00,
    description: "An extremely comfortable, lightweight salwar suit handcrafted in Jaipur. Made from premium fine cotton, printed with traditional indigo and ochre hand-block motifs, and finished with a pure kota doria cotton dupatta. Fits everyday luxury.",
    category: "Ladies Suits",
    stock: 12,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Fabric Material": "100% Pure Long-Staple Cambric Cotton",
      "Art Form": "Hand block Print using Eco-friendly Dyes",
      "Includes": "Unstitched Fabric Set (2.5m Top, 2.5m Bottom, 2.4m Dupatta)",
      "Colorway": "Natural Indigo Blue & Mustard Ochre",
      "Wash Care": "Gentle hand wash separately in cold water"
    },
    rating: 4.7,
    reviewsCount: 1,
    tags: ["suit", "jaipuri", "blockprint", "cotton", "salwar", "dailywear"],
    featured: false,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    name: "Ethereal Ivory Silk Zardozi Suit Set",
    price: 245.00,
    description: "A high-end cream-colored silk straight kurta set featuring fine hand-done Zardozi embroidery around the neckline and sleeve cuffs. Elevated with custom gold-tinted silk trousers and a hand-dyed crinkle chiffon dupatta.",
    category: "Ladies Suits",
    stock: 4,
    status: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1583391265517-35bbdad01209?q=80&w=800"
    ],
    videoUrl: "",
    specifications: {
      "Kurta Fabric": "Pure Raw Silk with cotton inner lining",
      "Pant Fabric": "Silk Blend Straight Trousers",
      "Dupatta": "Pure Chiffon with Zari borders",
      "Work Technique": "Handcrafted Zardozi (Metallic Gold wire stitching)",
      "Color": "Ivory/Cream with Champagne Gold borders"
    },
    rating: 4.9,
    reviewsCount: 2,
    tags: ["suit", "silk", "cream", "zardozi", "luxury", "partywear"],
    featured: true,
    isBestSeller: false,
    isNewArrival: true
  }
];

const seedCoupons = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 0,
    isActive: true
  },
  {
    code: "ROYALGOLD",
    discountType: "flat",
    discountValue: 50,
    minPurchase: 250,
    isActive: true
  },
  {
    code: "FREESHIP",
    discountType: "flat",
    discountValue: 15,
    minPurchase: 100,
    isActive: true
  }
];

const seedReviews = [
  {
    productId: "Royal Hand-Carved Sheesham Wood Trunk", // placeholder to link in script
    userName: "Sarah Jenkins (New York, USA)",
    rating: 5,
    comment: "Absolutely gorgeous chest. The brass details are glowing under my living room lights. Packing was extremely sturdy for shipping to New York. Strongly recommend!",
    helpfulVotes: 14
  },
  {
    productId: "Royal Hand-Carved Sheesham Wood Trunk",
    userName: "Arthur Pendelton (London, UK)",
    rating: 4,
    comment: "Stunning craftsmanship. Extremely heavy wood, exactly as premium Sheesham should be. Took 6 days to ship to London. Beautiful piece.",
    helpfulVotes: 8
  },
  {
    productId: "Kundan Royal Gold Plated Choker Necklace Set",
    userName: "Aishwarya R. (Sydney, Australia)",
    rating: 5,
    comment: "This set looks exactly like solid gold jewellery! The meenakari detailing on the back is so fine. Perfect accent for weddings.",
    helpfulVotes: 23
  },
  {
    productId: "Royal Sandalwood & Saffron Skin Radiance Elixir",
    userName: "Marie Dubois (Paris, France)",
    rating: 5,
    comment: "My dry patches have completely cleared up in a week! Scent is beautiful. A premium oil.",
    helpfulVotes: 9
  }
];

const runSeeder = async () => {
  try {
    await connectDB();

    // 1. Clear database collections
    console.log('Clearing database collections...');
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});
    
    // We only clear users with email shekhawaticollection@gmail.com
    await User.deleteMany({ email: 'shekhawaticollection@gmail.com' });

    console.log('Inserting seeded coupons...');
    for (const c of seedCoupons) {
      await Coupon.create(c);
    }

    console.log('Inserting admin account...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AdminPassword123', salt);
    await User.create({
      name: "Shekhawati Royal Admin",
      email: "shekhawaticollection@gmail.com",
      password: hashedPassword,
      role: "admin",
      rewardPoints: 1000
    });

    console.log('Inserting seeded products...');
    const createdProducts = [];
    for (const p of seedProducts) {
      const prod = await Product.create(p);
      createdProducts.push(prod);
    }

    console.log('Inserting seeded reviews...');
    for (const r of seedReviews) {
      // Find matching created product by matching name start
      const matchedProd = createdProducts.find(p => p.name.includes(r.productId) || r.productId.includes(p.name));
      if (matchedProd) {
        await Review.create({
          productId: matchedProd._id,
          userName: r.userName,
          rating: r.rating,
          comment: r.comment,
          helpfulVotes: r.helpfulVotes
        });
        console.log(`Created review for: ${matchedProd.name}`);
      }
    }

    console.log('--- SEEDING COMPLETED SUCCESSFULY ---');
    if (!isMongo) {
      console.log('Seeded database entries in c:\\Users\\sk083\\Desktop\\shekawati-collection\\backend\\data\\');
    }
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }
};

runSeeder();
