import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

// Seeding Data definitions
const users = [
  {
    name: 'Tickora Admin',
    email: 'admin@tickora.com',
    password: 'password123', // Will be hashed via User pre-save hook
    role: 'admin',
    addresses: [
      {
        street: 'Tickora Headquarters, Main Boulevard',
        city: 'Lahore',
        state: 'Punjab',
        zip: '54000',
        country: 'Pakistan',
        phone: '+923001234567',
        isDefault: true
      }
    ]
  },
  {
    name: 'Sohaib Khan',
    email: 'sohaib@tickora.com',
    password: 'password123',
    role: 'user',
    addresses: [
      {
        street: 'House #45, Street C, DHA Phase 6',
        city: 'Karachi',
        state: 'Sindh',
        zip: '75500',
        country: 'Pakistan',
        phone: '+923219876543',
        isDefault: true
      }
    ]
  }
];

const categories = [
  {
    name: 'Automatic',
    description: 'Precision mechanical self-winding timepieces showcasing intricate watchmaking craft.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'
  },
  {
    name: 'Quartz',
    description: 'Elegant, ultra-thin, low maintenance quartz movement watches for everyday prestige.',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600'
  },
  {
    name: 'Smart Hybrid',
    description: 'Modern smart wearables wrapped in timeless luxury watch casings.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600'
  },
  {
    name: 'Chronograph',
    description: 'Multi-functional luxury timers designed with sporty sophistication.',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600'
  }
];

const getProducts = (categoryIds) => [
  {
    name: 'Tickora Legacy Skeleton',
    description: 'A masterpiece of structural geometry, the Legacy Skeleton features an exposed automatic self-winding movement. Housed in surgical-grade 316L stainless steel, it details individual gears and bridge overlays in polished gold accents. Sapphire crystal glass on the front and display back ensures maximum durability and visual depth.',
    price: 45000,
    discountPrice: 39500,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800'
    ],
    category: categoryIds['Automatic'],
    stock: 12,
    sku: 'TICK-LEG-SKE-SLV',
    gender: 'Men',
    movement: 'Automatic',
    dialColor: 'Skeleton Gold/Silver',
    isFeatured: true,
    isLimitedEdition: true,
    tags: ['skeleton', 'mechanical', 'limited', 'automatic'],
    variants: [
      { color: 'Silver Steel', strapMaterial: 'Stainless Steel Mesh', stock: 8 },
      { color: 'Classic Gold', strapMaterial: 'Alligator Black Leather', stock: 4 }
    ],
    specifications: [
      { label: 'Case Material', value: '316L Stainless Steel' },
      { label: 'Case Diameter', value: '42mm' },
      { label: 'Glass', value: 'Scratch-resistant Sapphire Crystal' },
      { label: 'Power Reserve', value: '40 Hours' },
      { label: 'Water Resistance', value: '5 ATM (50m)' }
    ]
  },
  {
    name: 'Tickora Chrono Gold Elite',
    description: 'The Chrono Gold Elite represents performance merged with opulence. Boasting a rich gold electroplated case and dual-register chronograph layout, it incorporates a tachymeter bezel, date complications, and luminous hands. Perfect for business meetings or fine dinners.',
    price: 32000,
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800'
    ],
    category: categoryIds['Chronograph'],
    stock: 25,
    sku: 'TICK-CHR-GLD-ELT',
    gender: 'Men',
    movement: 'Quartz',
    dialColor: 'Deep Charcoal Black',
    isFeatured: true,
    isLimitedEdition: false,
    tags: ['chronograph', 'gold', 'prestige'],
    variants: [
      { color: 'Gilded Gold', strapMaterial: 'Oyster Gold Steel', stock: 15 },
      { color: 'Charcoal Black', strapMaterial: 'Suede Brown Leather', stock: 10 }
    ],
    specifications: [
      { label: 'Case Material', value: '18k Gold Plated Steel' },
      { label: 'Case Diameter', value: '43mm' },
      { label: 'Glass', value: 'Mineral Glass with Anti-reflective coating' },
      { label: 'Movement', value: 'Miyota Quartz Chronograph' },
      { label: 'Water Resistance', value: '10 ATM (100m)' }
    ]
  },
  {
    name: 'Tickora Minimalist Onyx',
    description: 'Stripped of all excesses, the Minimalist Onyx has a paper-thin profile, simple clean baton markers, and an elegant second-hand subdial. Designed for high fashion, it pairs seamlessly with formal or smart casual wear.',
    price: 18000,
    discountPrice: 15999,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=800'
    ],
    category: categoryIds['Quartz'],
    stock: 40,
    sku: 'TICK-MIN-ONYX-BLK',
    gender: 'Unisex',
    movement: 'Quartz',
    dialColor: 'Matte Onyx Black',
    isFeatured: false,
    isLimitedEdition: false,
    tags: ['minimalist', 'thin', 'quartz', 'unisex'],
    variants: [
      { color: 'Stealth Black', strapMaterial: 'Milanesa Steel Strap', stock: 20 },
      { color: 'Coffee Brown', strapMaterial: 'Italian Leather Strap', stock: 20 }
    ],
    specifications: [
      { label: 'Case Material', value: '316L Stainless Steel' },
      { label: 'Case Diameter', value: '38mm' },
      { label: 'Case Thickness', value: '6.5mm' },
      { label: 'Glass', value: 'Hardlex Glass' },
      { label: 'Water Resistance', value: '3 ATM (30m)' }
    ]
  },
  {
    name: 'Tickora Horizon Smart Hybrid',
    description: 'The best of both worlds. The Horizon combines mechanical watch hands with a stealth OLED circular display. Receive messages, track heart rate, count steps, and control music without sacrificing the classic premium look of a luxury steel timepiece. Battery runs up to 14 days on a single charge.',
    price: 28000,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800'
    ],
    category: categoryIds['Smart Hybrid'],
    stock: 18,
    sku: 'TICK-HRZ-SMT-BLK',
    gender: 'Unisex',
    movement: 'Smart',
    dialColor: 'Digital OLED / Dark Gunmetal',
    isFeatured: true,
    isLimitedEdition: false,
    tags: ['smart', 'hybrid', 'digital', 'fitness'],
    variants: [
      { color: 'Gunmetal Black', strapMaterial: 'FKM Sport Rubber', stock: 10 },
      { color: 'Brushed Silver', strapMaterial: 'Oyster Steel Link', stock: 8 }
    ],
    specifications: [
      { label: 'Case Material', value: 'Aerospace Grade Aluminum' },
      { label: 'Sensors', value: 'Optical Heart Rate, SpO2, Accelerometer' },
      { label: 'Display', value: 'Stealth OLED Circle' },
      { label: 'Battery Life', value: '14 Days (Smart Mode)' },
      { label: 'Water Resistance', value: '5 ATM (50m)' }
    ]
  },
  {
    name: 'Tickora Stella Pearl',
    description: 'Embellished with genuine crystal borders and a shimmering Mother of Pearl dial, the Stella Pearl is a tribute to feminine grace. The custom rose gold mesh strap conforms perfectly to the wrist, creating an unforgettable sparkle under lighting.',
    price: 22000,
    discountPrice: 19800,
    images: [
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=800'
    ],
    category: categoryIds['Quartz'],
    stock: 15,
    sku: 'TICK-STEL-PRL-RSG',
    gender: 'Women',
    movement: 'Quartz',
    dialColor: 'Mother of Pearl White',
    isFeatured: false,
    isLimitedEdition: false,
    tags: ['women', 'luxury', 'crystals', 'rose gold'],
    variants: [
      { color: 'Rose Gold', strapMaterial: 'Steel Mesh Rose Gold', stock: 10 },
      { color: 'Vanilla White', strapMaterial: 'Genuine Leather White', stock: 5 }
    ],
    specifications: [
      { label: 'Case Material', value: 'Rose Gold Pated Steel with CZ Crystals' },
      { label: 'Case Diameter', value: '34mm' },
      { label: 'Glass', value: 'Hardlex Glass' },
      { label: 'Movement', value: 'Swiss Quartz' },
      { label: 'Water Resistance', value: '3 ATM (30m)' }
    ]
  }
];

const seedData = async () => {
  try {
    // 1. Establish DB Connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding.');

    // 2. Clear Existing Database
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Coupon.deleteMany();
    console.log('Database collections cleared.');

    // 3. Seed Users
    const createdUsers = [];
    for (const u of users) {
      const userDoc = new User(u);
      await userDoc.save();
      createdUsers.push(userDoc);
    }
    console.log(`Seeded ${createdUsers.length} users.`);

    // 4. Seed Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Seeded ${createdCategories.length} categories.`);

    // Map categories by name to resolve IDs easily
    const categoryIds = {};
    createdCategories.forEach(cat => {
      categoryIds[cat.name] = cat._id;
    });

    // 5. Seed Products
    const productsToSeed = getProducts(categoryIds);
    const createdProducts = await Product.insertMany(productsToSeed);
    console.log(`Seeded ${createdProducts.length} products.`);

    // 6. Seed Coupons
    const coupons = [
      {
        code: 'TICKORA10',
        discountType: 'percentage',
        discountAmount: 10,
        minOrderAmount: 10000,
        maxDiscountAmount: 3000,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usageLimit: 100,
        isActive: true
      },
      {
        code: 'WELCOME5000',
        discountType: 'fixed',
        discountAmount: 5000,
        minOrderAmount: 30000,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        usageLimit: 50,
        isActive: true
      }
    ];
    await Coupon.insertMany(coupons);
    console.log('Seeded promotional coupons.');

    console.log('Database Seeding Successful!');
    process.exit(0);
  } catch (error) {
    console.error(`Database Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
