"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Search, Package, Sparkles } from "lucide-react";

export default function ComboProductFields({
  allProducts = [],
  comboItems = [],
  setComboItems,
  register,
  errors,
  currentProductId = null,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Filter available products (exclude self and current combo items)
  const availableProducts = (allProducts || []).filter((p) => {
    if (currentProductId && p.id === currentProductId) return false;
    if (p.productType === "combo") return false; // prevent nested combos
    const alreadySelected = comboItems.some(
      (item) => String(item.productId || item.id) === String(p.id)
    );
    if (alreadySelected) return false;
    if (!searchTerm.trim()) return true;
    return (
      p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const prod = allProducts.find((p) => String(p.id) === String(selectedProductId));
    if (!prod) return;

    const newItem = {
      productId: prod.id,
      quantity: Math.max(1, parseInt(selectedQuantity) || 1),
      product: {
        id: prod.id,
        productName: prod.productName,
        sku: prod.sku,
        price: prod.price,
        regularPrice: prod.regularPrice,
        quantity: prod.quantity,
        images: prod.images,
      },
    };

    setComboItems([...comboItems, newItem]);
    setSelectedProductId("");
    setSelectedQuantity(1);
    setSearchTerm("");
  };

  const handleRemoveProduct = (productId) => {
    setComboItems(
      comboItems.filter(
        (item) => String(item.productId || item.id) !== String(productId)
      )
    );
  };

  const handleUpdateQty = (productId, newQty) => {
    setComboItems(
      comboItems.map((item) => {
        if (String(item.productId || item.id) === String(productId)) {
          return { ...item, quantity: Math.max(1, parseInt(newQty) || 1) };
        }
        return item;
      })
    );
  };

  const getProductImg = (prod) => {
    if (!prod) return "/placeholder.png";
    if (Array.isArray(prod.images) && prod.images[0]) {
      return typeof prod.images[0] === "string" ? prod.images[0] : prod.images[0]?.url || "/placeholder.png";
    }
    if (typeof prod.images === "string" && prod.images.trim()) {
      try {
        const parsed = JSON.parse(prod.images);
        if (Array.isArray(parsed) && parsed[0]) {
          return typeof parsed[0] === "string" ? parsed[0] : parsed[0]?.url || "/placeholder.png";
        }
      } catch (_) {
        return prod.images;
      }
    }
    return prod.image || "/placeholder.png";
  };

  // Calculate sum of individual items' prices for reference
  const totalCombinedPrice = comboItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.product?.price || 0);
    return sum + itemPrice * (parseInt(item.quantity) || 1);
  }, 0);

  return (
    <div className="space-y-6 font-hind">
      {/* 1. Combo Selling Price & Offer Price (Base Fields) */}
      <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <Sparkles size={16} className="text-amber-600" />
          <span>কম্বো প্যাকেজ প্রাইসিং ও স্টক রুলস</span>
        </div>
        <p className="text-xs text-amber-800/80 leading-relaxed">
          কম্বো প্রোডাক্টের কোনো নিজস্ব স্টক বসাতে হবে না। কাস্টমার যখন কম্বো অর্ডার করবেন, তখন নিচে যুক্ত করা ইন্ডিভিজুয়াল সিঙ্গেল প্রোডাক্টগুলো থেকে স্বয়ংক্রিয়ভাবে স্টক কাটা হবে।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              কম্বো সেলিং প্রাইস (Selling Price) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 2500"
              {...register("price", { required: "Selling price is required" })}
              className={`w-full p-2.5 bg-white border ${
                errors?.price ? "border-red-500" : "border-slate-300"
              } rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none`}
            />
            {errors?.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              রেগুলার মূল্য (Regular Price / MRP)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 3200"
              {...register("regularPrice")}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              কাটা মূল্যে ডিসকাউন্ট দেখাতে দিন
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              কম্বোর মোট আসল মূল্য (রেফারেন্স)
            </label>
            <div className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 flex items-center justify-between">
              <span>আইটেমসমূহের মোট:</span>
              <span className="text-primary font-black">৳{totalCombinedPrice.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              কম্বোর আইটেমগুলোর রেগুলার মূল্যের যোগফল
            </span>
          </div>
        </div>
      </div>

      {/* 2. Add Component Products to Combo */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package size={16} className="text-primary" />
              <span>কম্বোর অন্তর্ভুক্ত প্রোডাক্টসমূহ (Select Products for Combo)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              এই কম্বো প্যাকেজে যেসব সিঙ্গেল প্রোডাক্ট থাকবে সেগুলো নির্বাচন করুন
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
            মোট আইটেম: {comboItems.length}টি
          </span>
        </div>

        {/* Add Product Selector Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="sm:col-span-7">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              প্রোডাক্ট নির্বাচন করুন (Search & Pick)
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              <option value="">-- প্রোডাক্ট বেছে নিন ({availableProducts.length}টি উপলব্ধ) --</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productName} {p.sku ? `(SKU: ${p.sku})` : ""} - বর্তমান স্টক: {p.quantity || 0}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              কম্বোতে সংখ্যা (Qty per Combo)
            </label>
            <input
              type="number"
              min="1"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-medium text-center focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="button"
              onClick={handleAddProduct}
              disabled={!selectedProductId}
              className={`w-full py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                selectedProductId
                  ? "bg-primary text-white hover:bg-primary-hover cursor-pointer shadow-xs"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Plus size={14} />
              <span>যুক্ত করুন</span>
            </button>
          </div>
        </div>

        {/* Selected Products Table / List */}
        {comboItems.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Package size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-500">
              এখনও কোনো প্রোডাক্ট যোগ করা হয়নি। উপরের ড্রপডাউন থেকে প্রোডাক্ট বেছে নিন।
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">প্রোডাক্ট</th>
                  <th className="py-2.5 px-3">বর্তমান স্টক</th>
                  <th className="py-2.5 px-3">মূল্য</th>
                  <th className="py-2.5 px-3 text-center">কম্বোতে পরিমাণ</th>
                  <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comboItems.map((item, idx) => {
                  const prod = item.product || {};
                  const pId = item.productId || item.id;
                  const imgSrc = getProductImg(prod);
                  const currentStock = parseInt(prod.quantity || 0);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded bg-white border border-slate-200 overflow-hidden relative shrink-0">
                            <Image
                              src={imgSrc}
                              alt={prod.productName || "Product"}
                              fill
                              className="object-contain"
                              unoptimized={typeof imgSrc === "string" && imgSrc.startsWith("http")}
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 line-clamp-1 block">
                              {prod.productName}
                            </span>
                            {prod.sku && (
                              <span className="text-[10px] text-slate-400">
                                SKU: {prod.sku}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-2 px-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            currentStock > 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}
                        >
                          {currentStock} টি
                        </span>
                      </td>

                      <td className="py-2 px-3 font-semibold text-slate-700">
                        ৳{parseFloat(prod.price || 0).toLocaleString()}
                      </td>

                      <td className="py-2 px-3 text-center">
                        <div className="inline-flex items-center border border-slate-300 rounded overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(pId, (parseInt(item.quantity) || 1) - 1)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 bg-white font-bold text-slate-800">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(pId, (parseInt(item.quantity) || 1) + 1)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(pId)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
