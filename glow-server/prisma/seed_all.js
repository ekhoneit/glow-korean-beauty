const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Importing complete local dataset into database...");

  const dataPath = path.join(__dirname, "local_seed_data.json");
  if (!fs.existsSync(dataPath)) {
    console.error("local_seed_data.json not found!");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  // 1. Store Settings
  if (data.storeSetting?.length) {
    for (const s of data.storeSetting) {
      const { id, createdAt, updatedAt, ...rest } = s;
      await prisma.storeSetting.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Store settings seeded");
  }

  // 2. Contact Us
  if (data.contactUs?.length) {
    for (const c of data.contactUs) {
      const { id, createdAt, updatedAt, ...rest } = c;
      await prisma.contactUs.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Contact Us seeded");
  }

  // 3. MainCategory
  if (data.mainCategory?.length) {
    for (const m of data.mainCategory) {
      const { id, createdAt, updatedAt, ...rest } = m;
      await prisma.mainCategory.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ MainCategory seeded");
  }

  // 4. Categories
  if (data.category?.length) {
    for (const c of data.category) {
      const { id, createdAt, updatedAt, ...rest } = c;
      await prisma.category.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Categories seeded");
  }

  // 5. SubCategories
  if (data.subCategory?.length) {
    for (const s of data.subCategory) {
      const { id, createdAt, updatedAt, ...rest } = s;
      await prisma.subCategory.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ SubCategories seeded");
  }

  // 6. Brands
  if (data.brand?.length) {
    for (const b of data.brand) {
      const { id, createdAt, updatedAt, ...rest } = b;
      await prisma.brand.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Brands seeded");
  }

  // 7. Units
  if (data.unit?.length) {
    for (const u of data.unit) {
      const { id, createdAt, updatedAt, ...rest } = u;
      await prisma.unit.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Units seeded");
  }

  // 8. Admin Role & User
  if (data.adminRole?.length) {
    for (const r of data.adminRole) {
      const { id, createdAt, updatedAt, ...rest } = r;
      await prisma.adminRole.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
  }

  if (data.adminUser?.length) {
    for (const u of data.adminUser) {
      const { id, createdAt, updatedAt, ...rest } = u;
      await prisma.adminUser.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Admin User seeded");
  }

  // 9. Products
  if (data.product?.length) {
    for (const p of data.product) {
      const { id, createdAt, updatedAt, ...rest } = p;
      await prisma.product.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Products seeded");
  }

  // 10. Hero Sliders
  if (data.heroSlider?.length) {
    for (const h of data.heroSlider) {
      const { id, createdAt, updatedAt, ...rest } = h;
      await prisma.heroSlider.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Hero Sliders seeded");
  }

  // 11. Collections
  if (data.collection?.length) {
    for (const col of data.collection) {
      const { id, createdAt, updatedAt, ...rest } = col;
      await prisma.collection.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Collections seeded");
  }

  // 11.5 Product Collections (Link products to collections)
  if (data.productCollection?.length) {
    for (const pc of data.productCollection) {
      const { id, createdAt, ...rest } = pc;
      await prisma.productCollection.upsert({
        where: {
          productId_collectionId: {
            productId: rest.productId,
            collectionId: rest.collectionId,
          },
        },
        create: rest,
        update: rest,
      });
    }
    console.log("✅ Product Collection links seeded");
  }

  // 12. Bento Gallery Cards
  if (data.bentoImageCard?.length) {
    for (const b of data.bentoImageCard) {
      const { id, createdAt, updatedAt, ...rest } = b;
      await prisma.bentoImageCard.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Bento Image Cards seeded");
  }

  // 13. Mid Banners
  if (data.midBanner?.length) {
    for (const m of data.midBanner) {
      const { id, createdAt, updatedAt, ...rest } = m;
      await prisma.midBanner.upsert({
        where: { id },
        create: { id, ...rest },
        update: rest,
      });
    }
    console.log("✅ Mid Banners seeded");
  }

  console.log("✨ ALL 100% OF LOCAL DATA SEEDED SUCCESSFULLY!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
