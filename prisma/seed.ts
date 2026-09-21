import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "TownKart@123";

async function main() {
  console.log("🌱 Seeding TownKart database...");

  // Hash the default password once for all users
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  console.log("🔐 Password hashed successfully");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.deliveryAssignment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.deliveryPartner.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@townkart.in",
      phone: "+91 98765 00001",
      name: "Sunil Deshmukh",
      passwordHash: passwordHash,
      role: "SUPER_ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      email: "supervisor@townkart.in",
      phone: "+91 98765 00002",
      name: "Vikram Mehta",
      passwordHash: passwordHash,
      role: "SUPERVISOR",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const dineshUser = await prisma.user.create({
    data: {
      email: "dinesh.rider@townkart.in",
      phone: "+91 98765 11001",
      name: "Dinesh Kumar",
      passwordHash: passwordHash,
      role: "DELIVERY_PARTNER",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  const meenaUser = await prisma.user.create({
    data: {
      email: "meena.rider@townkart.in",
      phone: "+91 98765 11002",
      name: "Meena Sharma",
      passwordHash: passwordHash,
      role: "DELIVERY_PARTNER",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
  });

  const rahulUser = await prisma.user.create({
    data: {
      email: "rahul.rider@townkart.in",
      phone: "+91 98765 11003",
      name: "Rahul Verma",
      passwordHash: passwordHash,
      role: "DELIVERY_PARTNER",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const customerAmit = await prisma.user.create({
    data: {
      email: "amit.sharma@example.com",
      phone: "+91 98765 43210",
      name: "Amit Sharma",
      passwordHash: passwordHash,
      role: "CUSTOMER",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  });

  const customerPooja = await prisma.user.create({
    data: {
      email: "pooja.verma@example.com",
      phone: "+91 98765 43211",
      name: "Pooja Verma",
      passwordHash: passwordHash,
      role: "CUSTOMER",
    },
  });

  const customerRakesh = await prisma.user.create({
    data: {
      email: "rakesh.malhotra@example.com",
      phone: "+91 98765 43212",
      name: "Rakesh Malhotra",
      passwordHash: passwordHash,
      role: "CUSTOMER",
    },
  });

  // 2. Create Addresses
  const addressAmit = await prisma.address.create({
    data: {
      userId: customerAmit.id,
      type: "HOME",
      fullName: "Amit Sharma",
      phone: "+91 98765 43210",
      houseBuilding: "Flat 402, Greenfield Heights",
      street: "Near Main Market, Civil Lines",
      landmark: "Opposite Town Hall",
      town: "Civil Lines",
      state: "Uttar Pradesh",
      pincode: "272206",
      isDefault: true,
      latitude: 26.8467,
      longitude: 80.9462,
    },
  });

  await prisma.address.create({
    data: {
      userId: customerPooja.id,
      type: "HOME",
      fullName: "Pooja Verma",
      phone: "+91 98765 43211",
      houseBuilding: "House No 12-B",
      street: "Kalyani Nagar, Ward 12",
      landmark: "Near Hanuman Mandir",
      town: "Civil Lines",
      state: "Uttar Pradesh",
      pincode: "272206",
      isDefault: true,
    },
  });

  // 3. Create Delivery Partners
  const riderDinesh = await prisma.deliveryPartner.create({
    data: {
      userId: dineshUser.id,
      name: "Dinesh Kumar",
      phone: "+91 98765 11001",
      vehicleType: "Hero Splendor Plus",
      vehicleNumber: "UP-32-DK-8910",
      status: "ONLINE",
      rating: 4.9,
      totalDeliveries: 142,
      todayEarnings: 1150.75,
    },
  });

  const riderMeena = await prisma.deliveryPartner.create({
    data: {
      userId: meenaUser.id,
      name: "Meena Sharma",
      phone: "+91 98765 11002",
      vehicleType: "Honda Activa 6G",
      vehicleNumber: "UP-32-MS-4521",
      status: "ONLINE",
      rating: 4.85,
      totalDeliveries: 98,
      todayEarnings: 890.0,
    },
  });

  const riderRahul = await prisma.deliveryPartner.create({
    data: {
      userId: rahulUser.id,
      name: "Rahul Verma",
      phone: "+91 98765 11003",
      vehicleType: "TVS iQube EV",
      vehicleNumber: "UP-32-RV-9921",
      status: "ONLINE",
      rating: 4.95,
      totalDeliveries: 180,
      todayEarnings: 1420.5,
    },
  });

  // 4. Create Delivery Zones
  const zoneA = await prisma.deliveryZone.create({
    data: {
      name: "Zone A — Town Center (0–3 km)",
      minDistanceKm: 0.0,
      maxDistanceKm: 3.0,
      deliveryFee: 0.0,
      freeDeliveryThreshold: 299.0,
      minOrderAmount: 99.0,
      estimatedMinutes: 20,
      active: true,
    },
  });

  const zoneB = await prisma.deliveryZone.create({
    data: {
      name: "Zone B — Civil Lines & Ward 12 (3–7 km)",
      minDistanceKm: 3.0,
      maxDistanceKm: 7.0,
      deliveryFee: 30.0,
      freeDeliveryThreshold: 499.0,
      minOrderAmount: 149.0,
      estimatedMinutes: 35,
      active: true,
    },
  });

  await prisma.deliveryZone.create({
    data: {
      name: "Zone C — Outer Suburbs (7–15 km)",
      minDistanceKm: 7.0,
      maxDistanceKm: 15.0,
      deliveryFee: 50.0,
      freeDeliveryThreshold: 799.0,
      minOrderAmount: 199.0,
      estimatedMinutes: 50,
      active: true,
    },
  });

  // 5. Create Categories
  const catGrocery = await prisma.category.create({
    data: {
      name: "Grocery",
      slug: "grocery",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
      displayOrder: 1,
    },
  });

  const catFresh = await prisma.category.create({
    data: {
      name: "Fruits & Vegetables",
      slug: "fruits-vegetables",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80",
      displayOrder: 2,
    },
  });

  const catElectronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      displayOrder: 3,
    },
  });

  const catFashion = await prisma.category.create({
    data: {
      name: "Fashion",
      slug: "fashion",
      image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop&q=80",
      displayOrder: 4,
    },
  });

  const catBeauty = await prisma.category.create({
    data: {
      name: "Beauty & Personal Care",
      slug: "beauty-personal-care",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
      displayOrder: 5,
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: "Home & Living",
      slug: "home-living",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80",
      displayOrder: 6,
    },
  });

  const catSports = await prisma.category.create({
    data: {
      name: "Sports & Fitness",
      slug: "sports-fitness",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80",
      displayOrder: 7,
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&auto=format&fit=crop&q=80",
      displayOrder: 8,
    },
  });

  // 6. Create Brands
  const brandSony = await prisma.brand.create({
    data: { name: "Sony", slug: "sony" },
  });
  const brandNoise = await prisma.brand.create({
    data: { name: "Noise", slug: "noise" },
  });
  const brandTownKart = await prisma.brand.create({
    data: { name: "TownKart Originals", slug: "townkart-originals" },
  });
  const brandAashirvaad = await prisma.brand.create({
    data: { name: "Aashirvaad", slug: "aashirvaad" },
  });
  const brandAmul = await prisma.brand.create({
    data: { name: "Amul", slug: "amul" },
  });
  const brandFortune = await prisma.brand.create({
    data: { name: "Fortune", slug: "fortune" },
  });

  // 7. Create Products
  // P1: Wireless Headphones (Hero floating card & Storefront showcase)
  const pHeadphones = await prisma.product.create({
    data: {
      name: "TownKart Studio Wireless Headphones",
      slug: "townkart-studio-wireless-headphones",
      description:
        "High-fidelity wireless over-ear headphones with 40-hour battery life, active noise isolation, fast charging, and plush memory foam ear cushions.",
      shortDescription: "Active Noise Isolation • 40Hr Battery • Fast Type-C Charge",
      categoryId: catElectronics.id,
      brandId: brandTownKart.id,
      sku: "WH-001",
      mrp: 1899.0,
      sellingPrice: 1499.0,
      stock: 42,
      lowStockThreshold: 10,
      status: "ACTIVE",
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 126,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
            alt: "Wireless Headphones Studio Black",
            isPrimary: true,
            displayOrder: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
            alt: "Headphones side profile",
            displayOrder: 2,
          },
        ],
      },
      variants: {
        create: [
          {
            name: "Midnight Black",
            sku: "WH-001-BLK",
            price: 1499.0,
            mrp: 1899.0,
            stock: 25,
            attributesJson: JSON.stringify({ color: "Midnight Black" }),
          },
          {
            name: "Pearl White",
            sku: "WH-001-WHT",
            price: 1499.0,
            mrp: 1899.0,
            stock: 17,
            attributesJson: JSON.stringify({ color: "Pearl White" }),
          },
        ],
      },
    },
  });

  // P2: Smart Watch (Hero floating card)
  const pSmartWatch = await prisma.product.create({
    data: {
      name: "Noise ColorFit Ultra Smart Watch",
      slug: "noise-colorfit-ultra-smart-watch",
      description:
        "1.75-inch HD TruView display, Bluetooth calling, 60 sports modes, heart rate and SpO2 tracking, IP68 water resistance with 7-day battery life.",
      shortDescription: "1.75\" HD Display • BT Calling • IP68 Water Resistant",
      categoryId: catElectronics.id,
      brandId: brandNoise.id,
      sku: "SW-002",
      mrp: 4999.0,
      sellingPrice: 2999.0,
      stock: 15,
      lowStockThreshold: 10,
      status: "ACTIVE",
      isFeatured: true,
      isNewArrival: true,
      rating: 4.6,
      reviewCount: 215,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
            alt: "Smart Watch front",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P3: Running Shoes (Hero floating card)
  const pRunningShoes = await prisma.product.create({
    data: {
      name: "Men's AeroStrider Running Shoes",
      slug: "mens-aerostrider-running-shoes",
      description:
        "Engineered breathable mesh upper, cloud-foam responsive cushioning, anti-skid rubber grip sole designed for everyday running and city walks.",
      shortDescription: "Ultra-Lightweight • Cloud Cushion • Breathable Knit",
      categoryId: catFashion.id,
      brandId: brandTownKart.id,
      sku: "RS-002",
      mrp: 2999.0,
      sellingPrice: 1999.0,
      stock: 15,
      lowStockThreshold: 10,
      status: "ACTIVE",
      isFeatured: true,
      isNewArrival: true,
      rating: 4.8,
      reviewCount: 89,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
            alt: "AeroStrider Running Shoes Crimson Red",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P4: Water Bottle (Hero floating card)
  const pWaterBottle = await prisma.product.create({
    data: {
      name: "Insulated Stainless Steel Water Bottle 1L",
      slug: "insulated-stainless-steel-water-bottle-1l",
      description:
        "Double-walled vacuum insulated bottle keeping beverages cold for 24 hours or hot for 12 hours. BPA-free, leakproof screw cap.",
      shortDescription: "24Hr Cold / 12Hr Hot • Grade 304 Steel • Leakproof",
      categoryId: catSports.id,
      brandId: brandTownKart.id,
      sku: "WB-003",
      mrp: 799.0,
      sellingPrice: 499.0,
      stock: 120,
      lowStockThreshold: 20,
      status: "ACTIVE",
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 310,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
            alt: "Stainless Steel Matte Black Bottle",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P5: Commuter Backpack (Low Stock in image!)
  const pBackpack = await prisma.product.create({
    data: {
      name: "TownCommute Anti-Theft Laptop Backpack",
      slug: "towncommute-anti-theft-laptop-backpack",
      description:
        "Water-resistant fabric, padded compartment for up to 15.6-inch laptops, hidden security pocket, integrated USB charging pass-through.",
      shortDescription: "15.6\" Laptop Sleeve • Water-Resistant • Anti-Theft",
      categoryId: catAccessories.id,
      brandId: brandTownKart.id,
      sku: "BP-004",
      mrp: 1999.0,
      sellingPrice: 1299.0,
      stock: 8,
      lowStockThreshold: 10,
      status: "ACTIVE",
      isNewArrival: true,
      rating: 4.5,
      reviewCount: 74,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
            alt: "Commuter Backpack Black",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P6: Sunglasses (Out of stock in image!)
  const pSunglasses = await prisma.product.create({
    data: {
      name: "Classic Polarized Wayfarer Sunglasses",
      slug: "classic-polarized-wayfarer-sunglasses",
      description:
        "UV400 protective polarized lenses reducing glare. Matte black lightweight frame with sturdy metal hinges.",
      shortDescription: "UV400 Polarized • Anti-Glare • Featherlight Frame",
      categoryId: catAccessories.id,
      brandId: brandTownKart.id,
      sku: "SG-005",
      mrp: 1499.0,
      sellingPrice: 899.0,
      stock: 0,
      lowStockThreshold: 10,
      status: "OUT_OF_STOCK",
      rating: 4.4,
      reviewCount: 52,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
            alt: "Polarized Sunglasses Wayfarer",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P7: Sony WH-1000XM5 (from Image 1 Product Detail)
  const pSonyXM5 = await prisma.product.create({
    data: {
      name: "Sony WH-1000XM5 Premium Noise Cancelling Headphones",
      slug: "sony-wh-1000xm5-wireless-noise-cancelling-headphones",
      description:
        "Industry-leading noise cancellation with 8 microphones and Auto NC Optimizer. Exceptional sound engineered with the Integrated Processor V1.",
      shortDescription: "Flagship ANC • 8 Mics • LDAC Hi-Res Audio",
      categoryId: catElectronics.id,
      brandId: brandSony.id,
      sku: "WH-SONY-001",
      mrp: 34999.0,
      sellingPrice: 28999.0,
      stock: 42,
      lowStockThreshold: 10,
      status: "ACTIVE",
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 412,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
            alt: "Sony WH-1000XM5 Headphones",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P8: Aashirvaad Atta 5kg (Daily Essential)
  const pAtta = await prisma.product.create({
    data: {
      name: "Aashirvaad Shudh Chakki Whole Wheat Atta 5kg",
      slug: "aashirvaad-shudh-chakki-whole-wheat-atta-5kg",
      description:
        "Made from 100% pure whole wheat grains ground in traditional stone chakki ensuring soft rotis and rich natural dietary fibre.",
      shortDescription: "100% Whole Wheat • Stone Ground • Zero Maida",
      categoryId: catGrocery.id,
      brandId: brandAashirvaad.id,
      sku: "GR-001",
      mrp: 285.0,
      sellingPrice: 245.0,
      stock: 85,
      lowStockThreshold: 20,
      status: "ACTIVE",
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 1420,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
            alt: "Whole wheat grain and flour",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P9: Amul Milk 1L (Critical Stockout from screenshot!)
  const pMilk = await prisma.product.create({
    data: {
      name: "Amul Taaza Fresh Toned Milk 1L",
      slug: "amul-taaza-fresh-toned-milk-1l",
      description: "Homogenized toned fresh milk, minimum 3.0% milk fat and 8.5% milk SNF.",
      shortDescription: "Fresh Toned Milk • Pasteurised • 1L Pouch",
      categoryId: catGrocery.id,
      brandId: brandAmul.id,
      sku: "GR-002",
      mrp: 54.0,
      sellingPrice: 52.0,
      stock: 3, // Critical stockout warning in Image 3
      lowStockThreshold: 10,
      status: "ACTIVE",
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 890,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80",
            alt: "Fresh Milk Glass & Jug",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P10: Fortune Sunflower Oil 1L
  const pOil = await prisma.product.create({
    data: {
      name: "Fortune Sunlite Refined Sunflower Oil 1L",
      slug: "fortune-sunlite-refined-sunflower-oil-1l",
      description:
        "Light and healthy edible cooking oil enriched with natural vitamins A & D for heart wellness.",
      shortDescription: "Refined Sunflower Oil • Vitamin A & D Enriched",
      categoryId: catGrocery.id,
      brandId: brandFortune.id,
      sku: "GR-003",
      mrp: 165.0,
      sellingPrice: 142.0,
      stock: 48,
      lowStockThreshold: 15,
      status: "ACTIVE",
      rating: 4.8,
      reviewCount: 340,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80",
            alt: "Refined Oil bottle",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P11: Farm Fresh Tomatoes 1kg
  const pTomatoes = await prisma.product.create({
    data: {
      name: "Farm Fresh Hybrid Tomatoes 1kg",
      slug: "farm-fresh-hybrid-tomatoes-1kg",
      description: "Directly sourced from local town farm mandis. Juicy, firm, and pesticide-tested.",
      shortDescription: "Farm Picked • Firm & Juicy • Fresh Daily",
      categoryId: catFresh.id,
      sku: "FV-001",
      mrp: 45.0,
      sellingPrice: 35.0,
      stock: 40,
      lowStockThreshold: 10,
      status: "ACTIVE",
      rating: 4.7,
      reviewCount: 220,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1546470427-0d4db154ceb7?w=800&auto=format&fit=crop&q=80",
            alt: "Ripe Red Tomatoes",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // P12: Fresh Paneer 200g
  const pPaneer = await prisma.product.create({
    data: {
      name: "Fresh Malai Paneer 200g Block",
      slug: "fresh-malai-paneer-200g-block",
      description: "Soft, rich, and creamy cottage cheese made from fresh cow and buffalo milk.",
      shortDescription: "Creamy Malai Paneer • 200g Fresh Pack",
      categoryId: catGrocery.id,
      sku: "GR-004",
      mrp: 95.0,
      sellingPrice: 85.0,
      stock: 18,
      lowStockThreshold: 10,
      status: "ACTIVE",
      rating: 4.9,
      reviewCount: 185,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
            alt: "Fresh Cottage Cheese Paneer",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // 8. Create Coupons
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      description: "10% off up to ₹150 on your shopping",
      discountType: "PERCENTAGE",
      discountValue: 10.0,
      minOrderAmount: 299.0,
      maxDiscountAmount: 150.0,
      active: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "SAVE100",
      description: "Flat ₹100 instant discount on orders above ₹999",
      discountType: "FIXED",
      discountValue: 100.0,
      minOrderAmount: 999.0,
      active: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "TOWNEXPRESS",
      description: "Free delivery & flat ₹50 off on orders above ₹499",
      discountType: "FIXED",
      discountValue: 50.0,
      minOrderAmount: 499.0,
      active: true,
    },
  });

  // 9. Create Banners
  await prisma.banner.create({
    data: {
      title: "Flash Sale — Up to 50% Off",
      subtitle: "Limited town inventory. Grab top audio, groceries & fashion before stock runs out.",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80",
      ctaText: "Shop Sale →",
      ctaLink: "/shop",
      position: "FLASH_SALE",
      active: true,
    },
  });

  await prisma.banner.create({
    data: {
      title: "Fresh Styles. Everyday Essentials.",
      subtitle: "Handpicked premium essentials delivered directly to your doorstep in 30 minutes.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
      ctaText: "Explore Collection →",
      ctaLink: "/shop",
      position: "PROMO_BOTTOM",
      active: true,
    },
  });

  // 10. Create Store Settings
  const settings = [
    { key: "store_name", value: "TownKart", description: "Store name" },
    {
      key: "store_tagline",
      value: "Everything you need. Right around the corner.",
      description: "Store tagline",
    },
    { key: "store_phone", value: "+91 80099 22444", description: "Customer helpline" },
    { key: "store_email", value: "support@townkart.in", description: "Support email" },
    {
      key: "store_address",
      value: "Civil Lines Fulfilment Hub #04, Ward 12, Anand Vihar",
      description: "Store location",
    },
    { key: "whatsapp_number", value: "919876543210", description: "WhatsApp chat phone" },
    { key: "free_delivery_threshold", value: "499", description: "Free delivery threshold" },
    { key: "delivery_base_fee", value: "30", description: "Base delivery charge" },
    { key: "flash_sale_end", value: "2026-10-15T23:59:59Z", description: "Flash sale timer end" },
    { key: "announcement_text", value: "🚚 Free Delivery on Orders Above ₹499  •  ⚡ Same-Day Express Delivery", description: "Announcement bar text" },
  ];

  for (const s of settings) {
    await prisma.storeSetting.create({ data: s });
  }

  // 11. Create Dispatch Pipeline Orders (matching Images 3, 4, 5)
  // O1: #TK-9835 (PENDING_PAYMENT)
  await prisma.order.create({
    data: {
      orderNumber: "TK-9835",
      userId: customerPooja.id,
      addressId: addressAmit.id,
      deliveryZoneId: zoneB.id,
      status: "PENDING_PAYMENT",
      subtotal: 348.0,
      deliveryFee: 30.0,
      totalAmount: 378.0,
      paymentMethod: "UPI",
      paymentStatus: "PENDING",
      deliveryOtp: "419820",
      notes: "UPI Intent awaiting confirmation",
      items: {
        create: [
          {
            productId: pPaneer.id,
            productName: "Mother Dairy Curd & Paneer Combo",
            quantity: 2,
            unitPrice: 85.0,
            totalAmount: 170.0,
          },
          {
            productId: pAtta.id,
            productName: "Aashirvaad Shudh Chakki Atta",
            quantity: 1,
            unitPrice: 178.0,
            totalAmount: 178.0,
          },
        ],
      },
    },
  });

  // O2: #TK-9834 (PENDING_PAYMENT)
  await prisma.order.create({
    data: {
      orderNumber: "TK-9834",
      userId: customerAmit.id,
      addressId: addressAmit.id,
      deliveryZoneId: zoneB.id,
      status: "PENDING_PAYMENT",
      subtotal: 890.0,
      deliveryFee: 0.0,
      totalAmount: 890.0,
      paymentMethod: "CARD",
      paymentStatus: "PENDING",
      deliveryOtp: "582103",
      notes: "Card Gateway Hook",
      items: {
        create: [
          {
            productId: pOil.id,
            productName: "Fortune Sunflower Oil 1L",
            quantity: 4,
            unitPrice: 142.0,
            totalAmount: 568.0,
          },
          {
            productId: pAtta.id,
            productName: "Tata Salt & Groceries",
            quantity: 2,
            unitPrice: 161.0,
            totalAmount: 322.0,
          },
        ],
      },
    },
  });

  // O3: #TK-9833 (CONFIRMED)
  await prisma.order.create({
    data: {
      orderNumber: "TK-9833",
      userId: customerAmit.id,
      addressId: addressAmit.id,
      deliveryZoneId: zoneA.id,
      status: "CONFIRMED",
      subtotal: 195.0,
      deliveryFee: 0.0,
      totalAmount: 195.0,
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      deliveryOtp: "721904",
      deliverySlot: "Today, 5:00 PM – 8:00 PM",
      notes: "1.2 km away • Auto-Accepted",
      items: {
        create: [
          {
            productId: pTomatoes.id,
            productName: "Farm Fresh Hybrid Tomatoes 1kg",
            quantity: 3,
            unitPrice: 35.0,
            totalAmount: 105.0,
          },
          {
            productId: pPaneer.id,
            productName: "Fresh Coriander & Herbs Combo",
            quantity: 1,
            unitPrice: 90.0,
            totalAmount: 90.0,
          },
        ],
      },
    },
  });

  // O4: #TK-9831 (PACKING - Dinesh picker)
  await prisma.order.create({
    data: {
      orderNumber: "TK-9831",
      userId: customerAmit.id,
      addressId: addressAmit.id,
      deliveryZoneId: zoneA.id,
      status: "PACKING",
      subtotal: 425.0,
      deliveryFee: 0.0,
      totalAmount: 425.0,
      paymentMethod: "UPI",
      paymentStatus: "PAID",
      deliveryOtp: "632190",
      pickerName: "Dinesh (Station #2)",
      notes: "04:18 elapsed • 5 items",
      items: {
        create: [
          {
            productId: pPaneer.id,
            productName: "Fresh Paneer 200g Block",
            quantity: 2,
            unitPrice: 85.0,
            totalAmount: 170.0,
          },
          {
            productId: pTomatoes.id,
            productName: "Shimla Mirch & Tomatoes",
            quantity: 1,
            unitPrice: 255.0,
            totalAmount: 255.0,
          },
        ],
      },
    },
  });

  // O5: #TK-9829 (READY_FOR_PICKUP - Bag B-04)
  await prisma.order.create({
    data: {
      orderNumber: "TK-9829",
      userId: customerRakesh.id,
      addressId: addressAmit.id,
      deliveryZoneId: zoneA.id,
      status: "READY_FOR_PICKUP",
      subtotal: 220.0,
      deliveryFee: 0.0,
      totalAmount: 220.0,
      paymentMethod: "UPI",
      paymentStatus: "PAID",
      deliveryOtp: "904128",
      baggingBay: "Bay B-04 Bagged",
      items: {
        create: [
          {
            productId: pWaterBottle.id,
            productName: "Insulated Water Bottle",
            quantity: 1,
            unitPrice: 220.0,
            totalAmount: 220.0,
          },
        ],
      },
    },
  });

  // O6: #TK-7492 (OUT_FOR_DELIVERY - Dinesh Kumar assigned, matching Image 5!)
  const order7492 = await prisma.order.create({
    data: {
      orderNumber: "TK-7492",
      userId: customerAmit.id,
      addressId: addressAmit.id,
      deliveryZoneId: zoneA.id,
      status: "OUT_FOR_DELIVERY",
      subtotal: 199.3,
      deliveryFee: 0.0,
      totalAmount: 199.3,
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      deliveryOtp: "849201", // Customer 6-digit OTP from Image 5
      deliverySlot: "Today, 5:00 PM – 8:00 PM",
      pickerName: "Station #1 Completed",
      baggingBay: "Bay A-01 Dispatched",
      items: {
        create: [
          {
            productId: pMilk.id,
            productName: "Premium Fresh Milk 1L",
            quantity: 2,
            unitPrice: 52.0,
            totalAmount: 104.0,
          },
          {
            productId: pTomatoes.id,
            productName: "Fresh Farm Tomatoes 1kg",
            quantity: 2,
            unitPrice: 47.65,
            totalAmount: 95.3,
          },
        ],
      },
    },
  });

  // Create Assignment for Order 7492 to Dinesh Kumar
  await prisma.deliveryAssignment.create({
    data: {
      orderId: order7492.id,
      partnerId: riderDinesh.id,
      acceptedAt: new Date(),
      pickedUpAt: new Date(),
      distanceKm: 3.2,
      partnerEarning: 85.0,
      codCollected: false,
    },
  });

  // O7: Completed Order
  await prisma.order.create({
    data: {
      orderNumber: "TK-7491",
      userId: customerAmit.id,
      addressId: addressAmit.id,
      deliveryZoneId: zoneB.id,
      status: "DELIVERED",
      subtotal: 1499.0,
      discount: 100.0,
      deliveryFee: 0.0,
      totalAmount: 1399.0,
      paymentMethod: "UPI",
      paymentStatus: "PAID",
      deliveryOtp: "112233",
      items: {
        create: [
          {
            productId: pHeadphones.id,
            productName: "TownKart Studio Wireless Headphones",
            quantity: 1,
            unitPrice: 1499.0,
            totalAmount: 1499.0,
          },
        ],
      },
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
