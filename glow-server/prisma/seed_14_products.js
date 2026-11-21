const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cloudinary images dictionary
const rawCloudinary = {
  1: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260285/vclajdxnqk7jq8ilxcrq.png", // 1.png: Rose PDRN
  2: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260286/mzzz6u5cfjfcybmwrdi1.png", // 2.png: Ceramide D Ampoule
  3: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260288/bll4irvdxt9kwxivqgqr.png", // 3.png: Retinol A Ampoule
  4: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260289/sj1arekn0c22fo3ywg8e.png", // 4.png: Ceramide Cream
  5: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260290/qm3va1bskcwnjre5dzgs.png", // 5.png: Retinol Cream
  6: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260292/zhpeduepqtpoubevn0ji.png", // 6.png: Clear Green Caviar Toner
  7: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260294/egeraowticr7faxnnebm.png", // 7.png: Cica Cleansing Oil
  8: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260296/bhxw8simjscxuradqvhl.png", // 8.png: Green Caviar Serum
  9: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260297/orxzcrctqvhavaoxd0o1.png", // 9.png: Green Caviar Cream
  10: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260299/mmbdlojuxkd3urwx6lrh.png", // 10.png: Aqua Cooling Tonic
  11: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260301/dimn4avyj69ceavoqihd.png", // 11.png: Cica Cooling Tonic
  12: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260302/zbn03nb5fz3ycyvppfsl.png", // 12.png: Hair Angel Ring
  13: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260304/vbpiknrtndrf5mhyisww.png", // 13.png: Hair Voluming Watery Essence
  14: "https://res.cloudinary.com/dkgo6wuq/image/upload/v1795260306/cv2eowfva3stk1c0rn5v.png"  // 15.png: Hair Protecting Floral Essence
};

// Swapped Mapping:
// Product 4 (Retinol Cream) gets 5
// Product 5 (Ceramide Cream) gets 4
// Product 7 (Hair Angel Ring) gets 12
// Product 12 (Relief Cica Cleansing Oil) gets 7
const productImages = {
  1: rawCloudinary[1],
  2: rawCloudinary[2],
  3: rawCloudinary[3],
  4: rawCloudinary[5], // Swapped
  5: rawCloudinary[4], // Swapped
  6: rawCloudinary[6],
  7: rawCloudinary[12], // Swapped
  8: rawCloudinary[8],
  9: rawCloudinary[9],
  10: rawCloudinary[10],
  11: rawCloudinary[11],
  12: rawCloudinary[7], // Swapped
  13: rawCloudinary[13],
  14: rawCloudinary[14]
};

// 14 Products definition (All SINGLE products, Tax Inclusive, Track Stock unticked)
const rawProducts = [
  {
    num: 1,
    title: "Rose PDRN K Vitamin K Water Soothing Cream – 100g",
    slug: "rose-pdrn-k-vitamin-k-water-soothing-cream-100g",
    sku: "GLOW-TZ-01",
    categoryName: "Moisturizers & Creams",
    price: 1350,
    regularPrice: 1650,
    desc: "Discover a refreshing skincare experience with Rose PDRN K Vitamin K Water Soothing Cream. Its lightweight cream formula is designed to provide a comfortable, hydrated feel while adding a soothing touch to your daily skincare routine. A beautiful addition to your everyday skincare essentials.",
    benefits: [
      "Infused with Rose PDRN and Vitamin K for intense soothing care",
      "Lightweight water-burst texture absorbs immediately without stickiness",
      "Helps improve skin barrier resilience and deeply hydrates",
      "Calms redness and sensitive skin after cleansing or sun exposure",
      "Authentic Made in Korea formula, 100g generous size"
    ],
    howToUse: "Take an appropriate amount at the last step of your skincare routine and spread evenly over the entire face. Gently pat for better absorption."
  },
  {
    num: 2,
    title: "Ceramide D Vitamin D Ampoule – 50ml",
    slug: "ceramide-d-vitamin-d-ampoule-50ml",
    sku: "GLOW-TZ-02",
    categoryName: "Serums & Ampoules",
    price: 1450,
    regularPrice: 1750,
    desc: "Give your skin a nourishing touch with Ceramide D Vitamin D Ampoule. Formulated with Ceramide NP and 7-Dehydrocholesterol, this lightweight ampoule is designed to support your daily skin-conditioning routine and leave your skin feeling soft and comfortable.",
    benefits: [
      "Concentrated Ceramide NP reinforces the damaged moisture barrier",
      "Contains Vitamin D precursor (7-Dehydrocholesterol) for energized, healthy vitality",
      "Deeply hydrates dry, flaking, or sensitized skin",
      "Fast-absorbing ampoule texture without greasy residue",
      "Cruelty-free & dermatologist tested Korean skincare"
    ],
    howToUse: "After applying toner, dispense 2-3 drops onto the face and gently massage into the skin until fully absorbed."
  },
  {
    num: 3,
    title: "Retinol A Vitamin A Ampoule – 50ml",
    slug: "retinol-a-vitamin-a-ampoule-50ml",
    sku: "GLOW-TZ-03",
    categoryName: "Serums & Ampoules",
    price: 1490,
    regularPrice: 1850,
    desc: "Elevate your skincare routine with Retinol A Vitamin A Ampoule. Featuring Retinyl Palmitate, Beta-Carotene and Astaxanthin, this skincare formula is designed to complement your regular skincare routine and give your skin a smooth, refreshed appearance.",
    benefits: [
      "Powerful antioxidant complex with Retinyl Palmitate, Beta-Carotene & Astaxanthin",
      "Visibly refines skin texture and boosts natural elasticity",
      "Promotes a radiant, rejuvenated glass-skin glow",
      "Gentle anti-aging formulation suitable for beginners",
      "Targets fine lines, enlarged pores, and dull uneven tone"
    ],
    howToUse: "During evening skincare, dispense a proper amount after toner. Smooth gently over face and follow with a moisturizing cream. Always wear sunscreen during daytime."
  },
  {
    num: 4,
    title: "Retinol A Vitamin A Silk Soothing Cream – 100g",
    slug: "retinol-a-vitamin-a-silk-soothing-cream-100g",
    sku: "GLOW-TZ-04",
    categoryName: "Moisturizers & Creams",
    price: 1390,
    regularPrice: 1700,
    desc: "Experience a silky skincare touch with Retinol A Vitamin A Silk Soothing Cream. Its smooth cream texture makes daily moisturising feel effortless while helping your skin feel soft, nourished and comfortable. A perfect addition to your everyday beauty routine.",
    benefits: [
      "Silky velvet texture wraps skin in deep, non-greasy nourishment",
      "Vitamin A complex gently refines surface skin texture overnight",
      "Strengthens the moisture barrier while soothing sensitive patches",
      "Leaves skin feeling bouncy, plump, and deeply hydrated",
      "Made in Korea, generous 100g jar for face and neck care"
    ],
    howToUse: "Apply an appropriate amount as the final stage of your evening skincare routine. Massage gently over the face and neck until absorbed."
  },
  {
    num: 5,
    title: "Ceramide D Vitamin D Silk Soothing Cream – 100g",
    slug: "ceramide-d-vitamin-d-silk-soothing-cream-100g",
    sku: "GLOW-TZ-05",
    categoryName: "Moisturizers & Creams",
    price: 1390,
    regularPrice: 1700,
    desc: "Pamper your skin with the smooth and comforting texture of Ceramide D Vitamin D Silk Soothing Cream. Designed for daily skincare, this cream helps maintain a moisturised feel and leaves your skin feeling soft, smooth and refreshed.",
    benefits: [
      "High-potency Ceramide formula locks in moisture for up to 48 hours",
      "Vitamin D infusion comforts stressed, tired skin exposed to pollution",
      "Silky texture melts instantly without clogging pores",
      "Prevents transepidermal water loss and rough dry flakes",
      "Ideal for all skin types, including dry and sensitive skin"
    ],
    howToUse: "Scoop a nickel-sized amount and spread evenly across the face morning and evening. Pat gently with fingertips."
  },
  {
    num: 6,
    title: "Clear Green Caviar Toner – 200ml",
    slug: "clear-green-caviar-toner-200ml",
    sku: "GLOW-TZ-06",
    categoryName: "Toner & Essence",
    price: 1250,
    regularPrice: 1550,
    desc: "Refresh and prepare your skin with Clear Green Caviar Toner. Its refreshing formula is designed to support your daily skin-balancing routine while leaving your skin feeling fresh and comfortable. An ideal step after cleansing and before applying serum or moisturiser.",
    benefits: [
      "Rich in Sea Grape (Green Caviar) extract packed with minerals and amino acids",
      "Restores optimal pH balance immediately after cleansing",
      "Clears dead skin cells and impurities while replenishing hydration",
      "Prepares skin to absorb active serums and creams more effectively",
      "Large 200ml volume for daily layering or toner-masking"
    ],
    howToUse: "After cleansing, soak a cotton pad or pour directly onto palms, and gently sweep across the face and neck."
  },
  {
    num: 7,
    title: "Hair Angel Ring Musk Essence – 100ml",
    slug: "hair-angel-ring-musk-essence-100ml",
    sku: "GLOW-TZ-07",
    categoryName: "Hair Essences & Oils",
    price: 1190,
    regularPrice: 1450,
    desc: "Give your hair a touch of care with Hair Angel Ring Musk Essence. Featuring a blend of 3 Gold Oil, Argan Kernel Oil, Sweet Almond Oil and Sunflower Seed Oil, this hair essence is designed to nourish the hair and enhance its soft, smooth and healthy-looking appearance.",
    benefits: [
      "Enriched with 3 Gold Oils (Argan, Sweet Almond, and Sunflower Seed Oils)",
      "Creates an instant glossy 'Angel Ring' shine on dull, frizzy hair",
      "Tames flyaways and prevents split ends without weighing hair down",
      "Leaves an alluring, long-lasting luxury white musk fragrance",
      "Lightweight non-sticky serum texture suitable for damp or dry hair"
    ],
    howToUse: "Pump 1-2 drops onto palms and evenly distribute through towel-dried or dry hair, focusing on mid-lengths and ends."
  },
  {
    num: 8,
    title: "Green Caviar Serum – 50ml",
    slug: "green-caviar-serum-50ml",
    sku: "GLOW-TZ-08",
    categoryName: "Serums & Ampoules",
    price: 1350,
    regularPrice: 1650,
    desc: "Add a refreshing touch to your skincare routine with Green Caviar Serum. Its lightweight serum formula is designed to complement your daily skincare steps, helping your skin feel hydrated, balanced and refreshed.",
    benefits: [
      "High concentration of Green Caviar (Sea Grape) for deep cellular hydration",
      "Provides vital nutrients, vitamins, and antioxidants directly to skin cells",
      "Improves skin bounce, firmness, and natural dewy radiance",
      "Watery cooling texture that penetrates rapidly without greasy feel",
      "Perfect for dehydrated skin lacking glow and vitality"
    ],
    howToUse: "Apply 2-3 drops onto cleansed and toned skin. Smooth gently until completely absorbed."
  },
  {
    num: 9,
    title: "Extra Capsule Green Caviar Cream – 50g",
    slug: "extra-capsule-green-caviar-cream-50g",
    sku: "GLOW-TZ-09",
    categoryName: "Moisturizers & Creams",
    price: 1450,
    regularPrice: 1750,
    desc: "Complete your skincare routine with Extra Capsule Green Caviar Cream. This moisturising cream is designed to provide a comfortable, nourished feel while helping maintain your skin's moisture. Its smooth texture makes it a great addition to everyday skincare.",
    benefits: [
      "Features moisture capsules suspended in a soothing nutrient-rich cream gel",
      "Capsules burst upon application, delivering fresh nutrients to skin",
      "Locks in deep hydration while building a protective barrier",
      "Smooths skin texture and enhances natural plumpness",
      "Dermatologically tested authentic Korean skincare formulation"
    ],
    howToUse: "At the final skincare step, apply a moderate amount onto face. Gently massage to melt the moisture capsules into skin."
  },
  {
    num: 10,
    title: "Aqua Cooling Tonic – Anti-Hair Loss Scalp Tonic – 100ml",
    slug: "aqua-cooling-tonic-anti-hair-loss-scalp-tonic-100ml",
    sku: "GLOW-TZ-10",
    categoryName: "Scalp Care & Tonics",
    price: 1250,
    regularPrice: 1550,
    desc: "Refresh your scalp with Aqua Cooling Tonic by Tenzero. This spray-type scalp tonic features an aqua-based formula with Hyaluronic Acid, Ceramide and Dexpanthenol. Designed for scalp care, it provides a refreshing cooling sensation and supports your regular hair-care routine.",
    benefits: [
      "KFDA functional certification for anti-hair loss and scalp strengthening",
      "Instant cooling effect reduces scalp temperature and excessive sebum",
      "Hyaluronic Acid & Ceramide nourish the scalp moisture barrier",
      "Dexpanthenol calms irritation, flaking, and itching",
      "Easy spray nozzle allows targeted application directly to hair roots"
    ],
    howToUse: "Shake well before use. Spray evenly onto the scalp and massage gently with fingertips for 1-2 minutes until absorbed. Do not rinse."
  },
  {
    num: 11,
    title: "Cica Cooling Tonic – Anti-Hair Loss Scalp Tonic – 100ml",
    slug: "cica-cooling-tonic-anti-hair-loss-scalp-tonic-100ml",
    sku: "GLOW-TZ-11",
    categoryName: "Scalp Care & Tonics",
    price: 1250,
    regularPrice: 1550,
    desc: "Give your scalp a refreshing experience with Cica Cooling Tonic. Formulated with Cica Complex, Centella Asiatica, Ceramide and Menthol, this spray-type tonic is designed to refresh the scalp and provide a cooling sensation as part of your regular hair-care routine.",
    benefits: [
      "High content Centella Asiatica (Cica Complex) calms troubled & irritated scalps",
      "Provides relief from heat, dandruff, irritation, and follicle inflammation",
      "Anti-hair loss care strengthens hair roots and follicle vitality",
      "Leaves scalp clean, refreshed, and pleasantly scented with menthol",
      "Non-greasy, watery mist that dries cleanly without residue"
    ],
    howToUse: "Shake bottle well. Section hair and spray directly onto clean scalp. Gently pat with fingers to stimulate absorption."
  },
  {
    num: 12,
    title: "Relief Cica Cleansing Oil – 150ml",
    slug: "relief-cica-cleansing-oil-150ml",
    sku: "GLOW-TZ-12",
    categoryName: "Cleansers",
    price: 1350,
    regularPrice: 1650,
    desc: "Make your cleansing routine more enjoyable with Relief Cica Cleansing Oil. Its lightweight oil formula helps dissolve makeup, sunscreen and everyday impurities, leaving your skin feeling clean and comfortable. A convenient first step in your daily double cleansing routine.",
    benefits: [
      "Gentle botanical oil emulsifies instantly with water to rinse cleanly away",
      "Dissolves waterproof makeup, excess sebum, and stubborn blackheads",
      "Infused with Centella Asiatica to soothe skin during the cleansing process",
      "Leaves skin soft, nourished, and hydrated without any greasy film",
      "Non-comedogenic, suitable for acne-prone and sensitive skin"
    ],
    howToUse: "Pump 2-3 times onto dry hands. Massage gently over dry face to melt makeup. Add warm water to emulsify into a milky fluid, then rinse thoroughly."
  },
  {
    num: 13,
    title: "Hair Voluming Watery Essence Lite – 100ml",
    slug: "hair-voluming-watery-essence-lite-100ml",
    sku: "GLOW-TZ-13",
    categoryName: "Hair Essences & Oils",
    price: 1190,
    regularPrice: 1450,
    desc: "Support your hair styling with Hair Voluming Watery Essence Lite. Its light essence formula helps hair feel fresh and manageable while adding a soft, natural touch to your everyday haircare routine.",
    benefits: [
      "Watery lightweight texture delivers natural root volume and bounce",
      "Hydrates flat, limp hair strands without any stickiness or heaviness",
      "Protects hair from heat styling and environmental humidity",
      "Adds a clean, natural gloss and fresh floral scent",
      "Perfect daily styling primer for fine and thin hair"
    ],
    howToUse: "Apply an appropriate amount to towel-dried or blow-dried hair. Style with fingers or hair dryer to build natural volume."
  },
  {
    num: 14,
    title: "Hair Protecting Floral Essence Oil – 100ml",
    slug: "hair-protecting-floral-essence-oil-100ml",
    sku: "GLOW-TZ-14",
    categoryName: "Hair Essences & Oils",
    price: 1190,
    regularPrice: 1450,
    desc: "Treat your hair to everyday care with Hair Protecting Floral Essence Oil. Formulated with selected oils and a pleasant floral fragrance, this essence oil is designed to support hair softness and complement your regular beauty routine.",
    benefits: [
      "Delicate floral bouquet aroma keeps hair smelling fresh all day",
      "Nourishing botanical oils seal hair cuticles to prevent frizz and breakage",
      "Provides thermal protection before flat-ironing or blow-drying",
      "Restores silkiness and radiant shine to damaged, color-treated hair",
      "Absorbs smoothly into strands without weighing hair down"
    ],
    howToUse: "Dispense 1-2 pumps into palms and smooth through damp or dry hair, focusing on split ends and damaged areas."
  }
];

function buildRichDescription(prod) {
  return `
<div class="product-description-content">
  <p class="lead-text"><strong>${prod.title}</strong> — ${prod.desc}</p>
  
  <h3 style="font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1f2937;">Key Benefits & Features:</h3>
  <ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; line-height: 1.8;">
    ${prod.benefits.map(b => `<li style="margin-bottom: 0.4rem;"><strong>${b.split(' ')[0]} ${b.split(' ')[1] || ''}</strong>: ${b}</li>`).join('')}
  </ul>

  <h3 style="font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1f2937;">How To Use:</h3>
  <p style="line-height: 1.7; margin-bottom: 1.5rem; color: #4b5563;">${prod.howToUse}</p>

  <h3 style="font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1f2937;">Product Information:</h3>
  <ul style="list-style-type: none; padding-left: 0; line-height: 1.8; color: #374151;">
    <li>✅ <strong>Brand:</strong> Tenzero Korea</li>
    <li>✅ <strong>Origin:</strong> Made in South Korea (100% Authentic Guaranteed)</li>
    <li>✅ <strong>Category:</strong> K-Beauty Skincare & Haircare</li>
    <li>✅ <strong>Suitability:</strong> Dermatologically Tested & Safe for Sensitive Skin</li>
  </ul>
</div>
`.trim();
}

async function main() {
  console.log("🌱 Seeding Clean 14 SINGLE Products (Tax: Inclusive, TrackStock: Unticked)...");

  // 1. Brand Tenzero only
  await prisma.brand.deleteMany({});
  const brand = await prisma.brand.create({
    data: {
      name: "Tenzero",
      image: productImages[1]
    }
  });
  console.log("✅ Brand Tenzero established:", brand.id);

  // 2. Clear old categories & products
  await prisma.productCollection.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.landingPage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 3. Create only the 6 relevant Categories & Subcategories
  const categoriesDef = [
    { code: "CAT-TE", name: "Toner & Essence" },
    { code: "CAT-SA", name: "Serums & Ampoules" },
    { code: "CAT-MC", name: "Moisturizers & Creams" },
    { code: "CAT-ST", name: "Scalp Care & Tonics" },
    { code: "CAT-HO", name: "Hair Essences & Oils" },
    { code: "CAT-CL", name: "Cleansers" }
  ];

  const categoryMap = {}; // name -> subCategoryId

  for (const cat of categoriesDef) {
    const category = await prisma.category.create({
      data: {
        code: cat.code,
        name: cat.name,
        mainCategoryId: 1,
        image: cat.code === 'CAT-TE' ? productImages[6] :
               cat.code === 'CAT-SA' ? productImages[2] :
               cat.code === 'CAT-MC' ? productImages[1] :
               cat.code === 'CAT-ST' ? productImages[10] :
               cat.code === 'CAT-HO' ? productImages[7] :
               productImages[12]
      }
    });

    const subCategory = await prisma.subCategory.create({
      data: {
        code: `SUB-${cat.code}`,
        name: cat.name,
        categoryId: category.id
      }
    });
    categoryMap[cat.name] = subCategory.id;
  }
  console.log("✅ 6 Categories created cleanly:", categoryMap);

  // 4. Ensure Collections exist
  await prisma.collection.deleteMany({});
  const col1 = await prisma.collection.create({
    data: { name: "Tenzero Best Sellers", slug: "tenzero-best-sellers" }
  });
  const col2 = await prisma.collection.create({
    data: { name: "Daily Skin & Hair Routine", slug: "daily-skin-hair-routine" }
  });
  console.log("✅ Collections established");

  // 5. Insert 14 Products strictly as SINGLE products (productType="single", taxType="inclusive", trackQuantity=false)
  const createdProducts = [];
  for (const item of rawProducts) {
    const cUrl = productImages[item.num];
    const htmlDesc = buildRichDescription(item);
    const targetSubCategoryId = categoryMap[item.categoryName];

    const prod = await prisma.product.create({
      data: {
        slug: item.slug,
        sku: item.sku,
        productName: item.title,
        productType: "single",       // Strictly SINGLE
        sellingType: "single",
        taxType: "inclusive",        // Tax Inclusive
        tax: 0,
        trackQuantity: false,        // Unticked: Track stock count false
        stockStatus: "IN_STOCK",     // Always In Stock
        quantity: 100,               // Default buffer
        subCategoryId: targetSubCategoryId,
        brandId: brand.id,
        unitId: 1, // Pcs
        price: item.price,
        regularPrice: item.regularPrice,
        images: [cUrl],
        description: htmlDesc
      }
    });

    // Link to collections
    await prisma.productCollection.create({
      data: {
        productId: prod.id,
        collectionId: col1.id
      }
    });
    if (item.num % 2 !== 0) {
      await prisma.productCollection.create({
        data: {
          productId: prod.id,
          collectionId: col2.id
        }
      });
    }

    createdProducts.push(prod);
    console.log(`✨ Single Product #${item.num} -> ${prod.productName} (Image: ${cUrl.substring(cUrl.lastIndexOf('/')+1)})`);
  }

  // 6. Flagship Landing Page
  await prisma.landingPage.create({
    data: {
      productId: createdProducts[0].id,
      slug: "rose-pdrn-k-cream",
      pageTitle: "Rose PDRN K Vitamin K Water Soothing Cream – 100g",
      subTitle: "Experience the ultimate Korean glass-skin hydration with Rose PDRN and Vitamin K formula",
      badgeText: "100% Authentic Korean Skincare",
      themeColor: "#D48B80",
      template: "korean_beauty",
      offerPrice: 1350,
      insideDhakaDelivery: 70,
      outsideDhakaDelivery: 130,
      bannerImages: [productImages[1], productImages[4], productImages[5]],
      relatedProductIds: [createdProducts[1].id, createdProducts[2].id, createdProducts[5].id],
      isPublished: true,
      whyChooseUsTitle: "কেন Tenzero Rose PDRN K Cream ব্যবহার করবেন?",
      features: [
        { title: "Rose PDRN & Vitamin K", desc: "ত্বকের ভেতর থেকে হাইড্রেশন লক করে এবং রেডনেস কমায়", icon: "Sparkles" },
        { title: "Water-Burst Texture", desc: "কোনো ধরনের আঠালো ভাব ছাড়াই ত্বকে মুহূর্তেই শোষিত হয়", icon: "ShieldCheck" },
        { title: "100% Authentic Korean", desc: "সরাসরি কোরিয়া থেকে আমদানিকৃত প্রিমিয়াম ফর্মুলা", icon: "Truck" }
      ],
      trustPoints: [
        { text: "১০০% অথেনটিক কোরিয়ান প্রোডাক্ট গ্যারান্টি" },
        { text: "ক্যাশ অন ডেলিভারি এবং দ্রুততম হোম ডেলিভারি" },
        { text: "পণ্য হাতে পেয়ে চেক করে নেওয়ার সুবিধা" }
      ],
      highlightsTitle: "Tenzero Rose PDRN K Cream এর বিশেষ সুবিধাসমূহ",
      highlights: [
        { title: "ডিপ ময়েশ্চারাইজিং", desc: "সারাদিন ত্বককে মখমলের মতো কোমল ও হাইড্রেটেড রাখে" },
        { title: "স্কিন ব্যারিয়ার রিপেয়ার", desc: "ত্বকের ক্ষতিগ্রস্ত স্কিন ব্যারিয়ার শক্তিশালী করতে সহায়তা করে" },
        { title: "সকল ত্বকের উপযোগী", desc: "তৈলাক্ত, শুষ্ক এবং সংবেদনশীল ত্বকে ব্যবহারযোগ্য" }
      ],
      reviews: [
        { name: "Sumaiya Akter", rating: 5, comment: "অনেক হালকা এবং ত্বক দারুণ হাইড্রেটেড রাখে। কোনো স্টিকিনেস নেই!", date: "2 days ago" },
        { name: "Nusrat Jahan", rating: 5, comment: "কোরিয়ান ক্রিমগুলোর মধ্যে এটা আমার দেখা সেরা সুদিং ক্রিম।", date: "1 week ago" }
      ]
    }
  });

  // 7. Update CMS: HeroSliders, BentoImageCard, MidBanner with correct Tenzero assets
  await prisma.heroSlider.deleteMany({});
  await prisma.heroSlider.createMany({
    data: [
      {
        badge: "KOREAN INNOVATION",
        title: "Tenzero Rose PDRN K Vitamin K Water Soothing Cream",
        sub_title: "100g generous size delivering ultra-hydrating glass skin hydration and soothing barrier care.",
        image: productImages[1],
        link: "/product/rose-pdrn-k-vitamin-k-water-soothing-cream-100g",
        categoryLink: "/product?category=Moisturizers%20%26%20Creams"
      },
      {
        badge: "BEST SELLING AMPOULE",
        title: "Tenzero Retinol A & Ceramide D High-Potency Ampoules",
        sub_title: "Intense skin barrier revitalization and antioxidant texture refining straight from Seoul.",
        image: productImages[3],
        link: "/product/retinol-a-vitamin-a-ampoule-50ml",
        categoryLink: "/product?category=Serums%20%26%20Ampoules"
      },
      {
        badge: "HAIR & SCALP CARE",
        title: "Tenzero Anti-Hair Loss Scalp Cooling Tonics",
        sub_title: "Cica & Aqua cooling scalp relief with KFDA functional anti-hair loss certified formula.",
        image: productImages[11],
        link: "/product/cica-cooling-tonic-anti-hair-loss-scalp-tonic-100ml",
        categoryLink: "/product?category=Scalp%20Care%20%26%20Tonics"
      }
    ]
  });

  await prisma.bentoImageCard.deleteMany({});
  await prisma.bentoImageCard.createMany({
    data: [
      {
        title: "Rose PDRN K Water Cream",
        sub_title: "Intense daily soothing care with Rose PDRN",
        image: productImages[1],
        link: "/product/rose-pdrn-k-vitamin-k-water-soothing-cream-100g",
        category: "Moisturizers & Creams"
      },
      {
        title: "Clear Green Caviar Toner",
        sub_title: "Sea grape mineral-rich balancing toner",
        image: productImages[6],
        link: "/product/clear-green-caviar-toner-200ml",
        category: "Toner & Essence"
      },
      {
        title: "Hair Angel Ring Musk Essence",
        sub_title: "3 Gold Oils for radiant glass hair shine",
        image: productImages[7],
        link: "/product/hair-angel-ring-musk-essence-100ml",
        category: "Hair Essences & Oils"
      }
    ]
  });

  await prisma.midBanner.deleteMany({});
  await prisma.midBanner.create({
    data: {
      title: "Experience 100% Authentic Korean Skincare",
      sub_title: "Specially formulated by Tenzero Seoul to restore hydration, repair damaged barriers, and deliver radiant glass skin.",
      image: productImages[2],
      link: "/product/ceramide-d-vitamin-d-ampoule-50ml",
      category: "Serums & Ampoules"
    }
  });

  // 8. Sync everything to local_seed_data.json
  const dataPath = path.join(__dirname, 'local_seed_data.json');
  const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  existing.brand = await prisma.brand.findMany();
  existing.category = await prisma.category.findMany();
  existing.subCategory = await prisma.subCategory.findMany();
  existing.collection = await prisma.collection.findMany();
  existing.heroSlider = await prisma.heroSlider.findMany();
  existing.bentoImageCard = await prisma.bentoImageCard.findMany();
  existing.midBanner = await prisma.midBanner.findMany();
  existing.product = await prisma.product.findMany();
  existing.productVariant = []; // No variants, strictly single products
  existing.productCollection = await prisma.productCollection.findMany();
  existing.landingPage = await prisma.landingPage.findMany();

  fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2));
  console.log("💾 local_seed_data.json updated completely with 100% clean single product data!");

  console.log("🎉 ALL 14 SINGLE PRODUCTS SEEDED CLEANLY!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
