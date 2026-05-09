const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Review = require('./models/Review');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);

    // 1. Admin user
    await User.create({
      name: 'Zell Admin',
      email: 'admin@zell.com',
      password: await bcrypt.hash('admin123', salt),
      role: 'admin'
    });

    // 2. Vendors
    const vendorsData = [
      {
        name: 'Alice Botanicals',
        email: 'alice@example.com',
        slug: 'alice-botanicals',
        bio: 'Hand-poured organic candles and ceramic planters.',
        accent: '#C8DDD4',
        products: [
          {
            name: 'Matcha Soy Candle',
            desc: 'A soothing matcha scented soy candle with a wooden wick.',
            price: 120000, // 1200 INR
            cat: 'wellness',
            inventory: 50,
            tags: ['handmade', 'organic', 'scented'],
            images: ['/images/matcha_candle.png'],
            specs: [{ key: 'Burn Time', value: '45 hours' }, { key: 'Wax', value: '100% Soy' }]
          },
          {
            name: 'Speckled Ceramic Planter',
            desc: 'Handmade ceramic planter with a unique speckled glaze.',
            price: 240000, // 2400 INR
            cat: 'ceramics',
            inventory: 12,
            tags: ['ceramics', 'home', 'decor'],
            images: ['/images/cat_planter.png'],
            specs: [{ key: 'Material', value: 'Stoneware' }, { key: 'Diameter', value: '5 inches' }]
          }
        ]
      },
      {
        name: 'Studio Minimal',
        email: 'minimal@example.com',
        slug: 'studio-minimal',
        bio: 'Essential, high-quality linen goods for your home.',
        accent: '#E8D5C4',
        products: [
          {
            name: 'Washed Linen Apron',
            desc: '100% French flax linen apron, pre-washed for softness.',
            price: 320000, // 3200 INR
            cat: 'kitchen',
            inventory: 30,
            tags: ['linen', 'kitchen', 'minimal'],
            images: ['/images/corgi_apron.png'],
            specs: [{ key: 'Material', value: '100% Linen' }, { key: 'Origin', value: 'France' }]
          },
          {
            name: 'Linen Throw Blanket',
            desc: 'Heavily textured linen throw, perfect for summer nights.',
            price: 580000, // 5800 INR
            cat: 'home-living',
            inventory: 15,
            tags: ['home', 'textile', 'cozy'],
            images: ['/images/linen_blanket.png'],
            specs: [{ key: 'Size', value: '150x200cm' }]
          }
        ]
      },
      {
        name: 'Luna Jewellery',
        email: 'luna@example.com',
        slug: 'luna-jewellery',
        bio: 'Contemporary silver jewellery inspired by celestial forms.',
        accent: '#D4CAEC',
        products: [
          {
            name: 'Orbit Silver Ring',
            desc: 'Recycled sterling silver ring with a polished finish.',
            price: 450000, // 4500 INR
            cat: 'jewellery',
            inventory: 8,
            tags: ['silver', 'ring', 'jewelry'],
            images: ['/images/silver_ring.png'],
            specs: [{ key: 'Material', value: '925 Silver' }]
          }
        ]
      }
    ];

    const buyerUser = await User.create({
      name: 'Test Buyer',
      email: 'buyer@example.com',
      password: commonPassword,
      role: 'buyer'
    });

    for (const v of vendorsData) {
      const user = await User.create({
        name: v.name,
        email: v.email,
        password: commonPassword,
        role: 'vendor'
      });

      const vendor = await Vendor.create({
        userId: user._id,
        storefront: {
          name: v.name,
          slug: v.slug,
          bio: v.bio,
          themeAccent: v.accent
        }
      });

      for (const p of v.products) {
        const product = await Product.create({
          vendorId: vendor._id,
          name: p.name,
          description: p.desc,
          price: p.price,
          category: p.cat,
          inventory: p.inventory,
          images: p.images || [],
          tags: p.tags,
          specifications: p.specs
        });

        // Add a mock review
        await Review.create({
          productId: product._id,
          userId: buyerUser._id,
          userName: buyerUser.name,
          rating: 5,
          title: 'Exquisite Quality!',
          body: 'I am blown away by the craftsmanship. Definitely buying again.',
          verified: true
        });
      }
    }

    console.log('\n✅ Database seeded successfully with rich data!\n');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
