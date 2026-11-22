"use client";

import {
    useCreateBentoImageCard,
    useDeleteBentoImageCard,
    useBentoImageCards,
    useUpdateBentoImageCard,
    useReorderBentoImageCards,
} from "@/hooks/useBentoImageCard";
import { useCategories } from "@/lib/dataFetch";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import CloudinaryImageInput from "../ui/CloudinaryImageInput";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Image from "next/image";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";

export const BentoImageGallery = () => {
    // Form state
    const [formData, setFormData] = useState({
        title: "",
        sub_title: "",
        image: "",
        link: "",
        category: "",
    });

    const [customCategory, setCustomCategory] = useState("");
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    const { bentoImageCards, isLoading, mutate } = useBentoImageCards();
    const { createBentoImageCard } = useCreateBentoImageCard();
    const { updateBentoImageCard } = useUpdateBentoImageCard();
    const { deleteBentoImageCard } = useDeleteBentoImageCard();
    const { reorderBentoImageCards } = useReorderBentoImageCards();
    const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

    // Local state for drag-and-drop order
    const [cardsList, setCardsList] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        if (Array.isArray(bentoImageCards)) {
            setCardsList(bentoImageCards);
        }
    }, [bentoImageCards]);

    // Categories list from API or fallback
    const dynamicCategories = Array.isArray(categoriesData)
        ? categoriesData.map(c => c.name)
        : (categoriesData?.data || categoriesData?.categories || []).map(c => c.name);

    const clearErrors = useCallback((field) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    const handleImageUpload = useCallback((url) => {
        setFormData((prev) => ({
            ...prev,
            image: url,
        }));
        clearErrors("image");
    }, [clearErrors]);

    const handleImageError = useCallback((error) => {
        setErrors((prev) => ({
            ...prev,
            image: { message: error },
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategorySelect = (category) => {
        setFormData((prev) => ({
            ...prev,
            category,
        }));
        setCustomCategory("");
    };

    const handleCustomCategoryChange = (e) => {
        const value = e.target.value;
        setCustomCategory(value);
        setFormData((prev) => ({
            ...prev,
            category: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = { message: "Title is required" };
        }

        if (!formData.image.trim()) {
            newErrors.image = { message: "Card image is required" };
        }

        if (!formData.category.trim()) {
            newErrors.category = { message: "Category is required" };
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (editingId) {
                await updateBentoImageCard(editingId, formData);
                toast.success("Bento card updated successfully");
                setEditingId(null);
            } else {
                await createBentoImageCard(formData);
                toast.success("Bento card created successfully");
            }

            setFormData({
                title: "",
                sub_title: "",
                image: "",
                link: "",
                category: "",
            });
            setCustomCategory("");
            setErrors({});

            mutate();
        } catch (error) {
            toast.error(error.message || "Something went wrong");
            console.error("Submit error:", error);
        }
    };

    const handleEdit = (card) => {
        setFormData({
            title: card.title || "",
            sub_title: card.sub_title || "",
            image: card.image,
            link: card.link || "",
            category: card.category || "",
        });
        setEditingId(card.id);
        setErrors({});

        if (!dynamicCategories.includes(card.category)) {
            setCustomCategory(card.category);
        } else {
            setCustomCategory("");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Bento Card?",
            text: "This card will be permanently removed from the gallery.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await deleteBentoImageCard(id);
                toast.success("Bento card deleted successfully");
                mutate();
            } catch (error) {
                toast.error(error.message || "Failed to delete bento card");
            }
        }
    };

    // --- Drag and Drop & Ordering Logic ---
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const updated = [...cardsList];
        const draggedItem = updated[draggedIndex];
        updated.splice(draggedIndex, 1);
        updated.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        setCardsList(updated);
    };

    const handleDragEnd = async () => {
        setDraggedIndex(null);
        await saveNewOrder(cardsList);
    };

    const moveCard = async (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= cardsList.length) return;

        const updated = [...cardsList];
        const [movedItem] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, movedItem);

        setCardsList(updated);
        await saveNewOrder(updated);
    };

    const saveNewOrder = async (orderedList) => {
        try {
            setIsReordering(true);
            const orderedIds = orderedList.map(item => item.id);
            await reorderBentoImageCards(orderedIds);
            toast.success("Display order updated!");
            mutate();
        } catch (err) {
            console.error("Failed to reorder:", err);
            toast.error("Failed to save order");
            mutate();
        } finally {
            setIsReordering(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Column */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-stone-200">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? "Edit Bento Card" : "Create New Bento Card"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    placeholder="Card title"
                                    required
                                />
                            </div>

                            {/* Sub Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Sub Title <span className="text-xs text-gray-500">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="sub_title"
                                    value={formData.sub_title}
                                    onChange={handleChange}
                                    className="w-full p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    placeholder="Supporting text or description"
                                />
                            </div>

                            {/* Cloudinary Upload */}
                            <div>
                                <CloudinaryImageInput
                                    label="Card Image"
                                    onUpload={handleImageUpload}
                                    onError={handleImageError}
                                    required
                                />
                                {errors.image && (
                                    <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>
                                )}
                                {formData.image && !errors.image && (
                                    <p className="text-sm text-green-600 mt-1 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Image uploaded successfully
                                    </p>
                                )}
                                <p className="text-[10px] text-gray-500 mt-1">Recommended: square image (400x400px) or 1:1 ratio</p>
                            </div>

                            {/* Link */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Link</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="w-full p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    placeholder="Enter product URL or /product link"
                                />
                            </div>

                            {/* Dynamic Category Selector */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleCategorySelect(e.target.value)}
                                    className="w-full p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">Select category</option>
                                    {dynamicCategories.length > 0 ? (
                                        dynamicCategories.map((catName) => (
                                            <option key={catName} value={catName}>
                                                {catName}
                                            </option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="Toner & Essence">Toner & Essence</option>
                                            <option value="Serums & Ampoules">Serums & Ampoules</option>
                                            <option value="Moisturizers & Creams">Moisturizers & Creams</option>
                                            <option value="Scalp Care & Tonics">Scalp Care & Tonics</option>
                                            <option value="Hair Essences & Oils">Hair Essences & Oils</option>
                                            <option value="Cleansers">Cleansers</option>
                                        </>
                                    )}
                                    <option value="custom">+ Custom Category</option>
                                </select>

                                {/* Custom Category Field (if custom selected or non-predefined) */}
                                {(formData.category === "custom" || (customCategory && !dynamicCategories.includes(formData.category))) && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={customCategory}
                                            onChange={handleCustomCategoryChange}
                                            placeholder="Type custom category name..."
                                            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                            >
                                {editingId ? "Update Card" : "Create Card"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({
                                            title: "",
                                            sub_title: "",
                                            image: "",
                                            link: "",
                                            category: "",
                                        });
                                        setCustomCategory("");
                                        setErrors({});
                                    }}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Cards List Column with Drag & Drop */}
                <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-stone-200">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-bold">
                                All Bento Cards ({cardsList.length})
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Drag & drop cards or use arrows to rearrange the order in frontend.
                            </p>
                        </div>
                        {isReordering && (
                            <span className="text-xs text-primary font-medium animate-pulse">
                                Updating order...
                            </span>
                        )}
                    </div>

                    {!cardsList || cardsList.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-4xl mb-2">🎴</div>
                            <p className="font-medium text-gray-600">No bento cards yet.</p>
                            <p className="text-xs mt-1">Create your first bento grid card from the form!</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                            {cardsList.map((card, index) => (
                                <div
                                    key={card.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 bg-white ${
                                        draggedIndex === index ? "opacity-40 border-dashed border-primary scale-[0.98]" : ""
                                    }`}
                                >
                                    <div className="flex items-center">
                                        {/* Drag Handle & Order */}
                                        <div className="w-12 py-4 flex flex-col items-center justify-center bg-gray-50/80 border-r border-gray-100 cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors">
                                            <GripVertical size={16} className="text-gray-400 mb-1" />
                                            <div className="text-sm font-extrabold text-gray-700">
                                                {index + 1}
                                            </div>
                                            <div className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">
                                                Order
                                            </div>
                                        </div>

                                        {/* Thumbnail */}
                                        <div className="w-20 h-20 flex-shrink-0 relative m-2 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <Image
                                                src={card.image}
                                                alt={card.title}
                                                className="object-cover"
                                                fill
                                                sizes="80px"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 p-3 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-bold text-sm text-gray-900 truncate">
                                                        {card.title}
                                                    </h3>
                                                    {card.sub_title && (
                                                        <p className="text-gray-500 text-xs mt-0.5 truncate">
                                                            {card.sub_title}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        {card.category && (
                                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                                                                {card.category}
                                                            </span>
                                                        )}
                                                        <span className="text-[11px] text-gray-400">
                                                            {new Date(card.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons: Move Up/Down, Edit, Delete */}
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    {/* Move Up Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => moveCard(index, -1)}
                                                        disabled={index === 0}
                                                        title="Move Up"
                                                        className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>

                                                    {/* Move Down Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => moveCard(index, 1)}
                                                        disabled={index === cardsList.length - 1}
                                                        title="Move Down"
                                                        className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(card)}
                                                        className="text-emerald-700 hover:bg-emerald-50 border border-emerald-600/40 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(card.id)}
                                                        className="text-rose-600 hover:bg-rose-50 border border-rose-500/40 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
