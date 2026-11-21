const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cloudinaryUrls = JSON.parse(
  fs.readFileSync('C:/Users/Siyan/.gemini/antigravity/brain/c6579d48-089f-4269-99fa-15d7390b6222/scratch/uploaded_cloudinary_images.json', 'utf8')
);

// 14 Products definition
const rawProducts = [
  {
    num: 1,
    title: "Rose PDRN K Vitamin K Water Soothing Cream – 100g",
    slug: "rose-pdrn-k-vitamin-k-water-soothing-cream-100g",
    sku: "GLOW-TZ-01",
    subCategoryId: 3, // Moisturizers & Creams
    brandName: "Tenzero",
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
    subCategoryId: 2, // Serums & Ampoules
    brandName: "Tenzero",
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
    subCategoryId: 2, // Serums & Ampoules
    brandName: "Tenzero",
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
    subCategoryId: 3, // Moisturizers & Creams
    brandName: "Tenzero",
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
    subCategoryId: 3, // Moisturizers & Creams
    brandName: "Tenzero",
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
    subCategoryId: 1, // Toner & Essence
    brandName: "Tenzero",
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
    subCategoryId: 8, // Hair Essences & Oils
    brandName: "Tenzero",
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
    subCategoryId: 2, // Serums & Ampoules
    brandName: "Tenzero",
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
    subCategoryId: 3, // Moisturizers & Creams
    brandName: "Tenzero",
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
    subCategoryId: 7, // Scalp Care & Tonics
    brandName: "Tenzero",
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
    subCategoryId: 7, // Scalp Care & Tonics
    brandName: "Tenzero",
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
    subCategoryId: 9, // Cleansers
    brandName: "Tenzero",
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
    subCategoryId: 8, // Hair Essences & Oils
    brandName: "Tenzero",
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
    subCategoryId: 8, // Hair Essences & Oils
    brandName: "Tenzero",
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
    <li>âœ… <strong>Brand:</strong> Tenzero Korea</li>
    <li>âœ… <strong>Origin:</strong> Made in South Korea (100% Authentic Guaranteed)</li>
    <li>âœ… <strong>Category:</strong> K-Beauty Skincare & Haircare</li>
    <li>âœ… <strong>Suitability:</strong> Dermatologically Tested & Safe for Sensitive Skin</li>
  </ul>
</div>
`.trim();
}

async function main() {
  console.log("🌱 Starting 14 Dynamic Korean Skincare Products Seed...");

  // 1. Ensure Brand 'Tenzero' exists
  let brand = await prisma.brand.findFirst({ where: { name: "Tenzero" } });
  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: "Tenzero",
        image: cloudinaryUrls[1]
      }
    });
    console.log("✅ Brand Tenzero created");
  } else {
    console.log("✅ Brand Tenzero found:", brand.id);
  }

  // 2. Ensure Categories & Subcategories exist
  const requiredCategories = [
    { code: "CAT-TE", name: "Toner & Essence", mainCategoryId: 1 },
    { code: "CAT-SA", name: "Serums & Ampoules", mainCategoryId: 1 },
    { code: "CAT-MC", name: "Moisturizers & Creams", mainCategoryId: 1 },
    { code: "CAT-ST", name: "Scalp Care & Tonics", mainCategoryId: 1 },
    { code: "CAT-HO", name: "Hair Essences & Oils", mainCategoryId: 1 },
    { code: "CAT-CL", name: "Cleansers", mainCategoryId: 1 }
  ];

  const categoryMap = {}; // name -> subCategoryId

  for (const cat of requiredCategories) {
    let category = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          code: cat.code,
          name: cat.name,
          mainCategoryId: cat.mainCategoryId,
          image: cloudinaryUrls[1]
        }
      });
    }

    let subCategory = await prisma.subCategory.findFirst({ where: { name: cat.name, categoryId: category.id } });
    if (!subCategory) {
      subCategory = await prisma.subCategory.create({
        data: {
          code: `SUB-${cat.code}`,
          name: cat.name,
          categoryId: category.id
        }
      });
    }
    categoryMap[cat.name] = subCategory.id;
  }
  console.log("✅ Categories & SubCategories ready:", categoryMap);

  // 3. Ensure Collections exist
  let col1 = await prisma.collection.findFirst({ where: { slug: "tenzero-best-sellers" } });
  if (!col1) {
    col1 = await prisma.collection.create({
      data: { name: "Tenzero Best Sellers", slug: "tenzero-best-sellers" }
    });
  }
  let col2 = await prisma.collection.findFirst({ where: { slug: "daily-skin-hair-routine" } });
  if (!col2) {
    col2 = await prisma.collection.create({
      data: { name: "Daily Skin & Hair Routine", slug: "daily-skin-hair-routine" }
    });
  }
  console.log("✅ Collections ready:", col1.id, col2.id);

  // 4. Clean out old products and associations
  console.log("🧹 Clearing old products and variants...");
  await prisma.productCollection.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.landingPage.deleteMany({});
  await prisma.product.deleteMany({});
  console.log("✅ Old products deleted cleanly");

  // 5. Insert 14 Products
  const createdProducts = [];
  for (const item of rawProducts) {
    const cUrl = cloudinaryUrls[item.num];
    const htmlDesc = buildRichDescription(item);
    const targetSubCategoryId = item.subCategoryId === 3 ? categoryMap["Moisturizers & Creams"] :
                                item.subCategoryId === 2 ? categoryMap["Serums & Ampoules"] :
                                item.subCategoryId === 1 ? categoryMap["Toner & Essence"] :
                                item.subCategoryId === 7 ? categoryMap["Scalp Care & Tonics"] :
                                item.subCategoryId === 8 ? categoryMap["Hair Essences & Oils"] :
                                item.subCategoryId === 9 ? categoryMap["Cleansers"] :
                                Object.values(categoryMap)[0];

    const prod = await prisma.product.create({
      data: {
        slug: item.slug,
        sku: item.sku,
        productName: item.title,
        sellingType: "single",
        subCategoryId: targetSubCategoryId,
        brandId: brand.id,
        unitId: 1, // Pcs
        price: item.price,
        regularPrice: item.regularPrice,
        quantity: 100,
        stockStatus: "IN_STOCK",
        trackQuantity: true,
        images: [cUrl],
        description: htmlDesc
      }
    });

    // Create single variant for pricing/stock accuracy
    await prisma.productVariant.create({
      data: {
        productId: prod.id,
        sku: `${item.sku}-DEFAULT`,
        price: item.price,
        regularPrice: item.regularPrice,
        quantity: 100,
        isDefault: true,
        image: cUrl,
        attributes: { "Default": "Standard" }
      }
    });

    // Map to collections: all 14 in collection 1 (Best Sellers), odd in collection 2
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
    console.log(`✨ Created Product #${item.num}: ${prod.productName} (ID: ${prod.id})`);
  }

  // 6. Create Landing Page for the flagship product (Rose PDRN K Cream)
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
      bannerImages: [cloudinaryUrls[1], cloudinaryUrls[2], cloudinaryUrls[3]],
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
  console.log("✅ Flagship Landing Page created with dynamic Cloudinary media and related products!");

  console.log("🎉 ALL 14 PRODUCTS CREATED WITH DYNAMIC CLOUDINARY URLS!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
