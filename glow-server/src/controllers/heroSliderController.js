// src/controllers/hero-slider.controller.js
const prisma = require('../utils/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create Hero Slider
const createHeroSlider = async (req, res) => {
    try {
        const { sub_title, title, image, link, badge, categoryLink, productId } = req.body;

        const newHeroSlider = await prisma.heroSlider.create({
            data: {
                sub_title: sub_title || '',
                title: title || '',
                image: image || '',
                link: link || '',
                badge: badge || null,
                categoryLink: categoryLink || null,
                productId: productId ? parseInt(productId) : null
            },
            include: {
                product: {
                    select: {
                        id: true,
                        slug: true,
                        productName: true,
                        price: true,
                        regularPrice: true,
                        discountType: true,
                        discountValue: true,
                        images: true,
                        sku: true,
                        productVariants: {
                            select: {
                                id: true,
                                image: true,
                                price: true,
                                regularPrice: true,
                                attributes: true
                            }
                        }
                    }
                }
            }
        });

        return successResponse(res, 'Hero slider created successfully', newHeroSlider, 201);
    } catch (error) {
        console.error('Create hero slider error:', error);
        return errorResponse(res, 'Failed to create hero slider', 500);
    }
};

// Get All Hero Sliders
const getAllHeroSliders = async (req, res) => {
    try {
        let heroSliders;
        const includeConfig = {
            product: {
                select: {
                    id: true,
                    slug: true,
                    productName: true,
                    price: true,
                    regularPrice: true,
                    discountType: true,
                    discountValue: true,
                    images: true,
                    sku: true,
                    productVariants: {
                        select: {
                            id: true,
                            image: true,
                            price: true,
                            regularPrice: true,
                            attributes: true
                        }
                    }
                }
            }
        };

        try {
            heroSliders = await prisma.heroSlider.findMany({
                orderBy: [
                    { priority: 'asc' },
                    { createdAt: 'asc' }
                ],
                include: includeConfig
            });
        } catch (prismaErr) {
            heroSliders = await prisma.heroSlider.findMany({
                orderBy: { createdAt: 'desc' },
                include: includeConfig
            });
            heroSliders.sort((a, b) => {
                if (a.priority !== undefined && b.priority !== undefined) {
                    return a.priority - b.priority;
                }
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
        }

        return successResponse(res, heroSliders);
    } catch (error) {
        console.error('Get all hero sliders error:', error);
        return errorResponse(res, 'Failed to retrieve hero sliders', 500);
    }
};

// Reorder Hero Sliders
const reorderHeroSliders = async (req, res) => {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return errorResponse(res, 'orderedIds must be a non-empty array of slider IDs', 400);
        }

        try {
            await prisma.$transaction(
                orderedIds.map((id, index) =>
                    prisma.heroSlider.update({
                        where: { id: parseInt(id) },
                        data: { priority: index + 1 }
                    })
                )
            );
        } catch (reorderErr) {
            console.warn('Prisma transaction reorder hero sliders failed, fallback to raw SQL:', reorderErr.message);
            for (let i = 0; i < orderedIds.length; i++) {
                const sliderId = parseInt(orderedIds[i]);
                await prisma.$executeRawUnsafe(
                    `UPDATE HeroSlider SET priority = ? WHERE id = ?`,
                    i + 1,
                    sliderId
                ).catch((err) => {
                    console.error(`Failed to update priority for hero slider ${sliderId}:`, err.message);
                });
            }
        }

        return successResponse(res, 'Hero sliders reordered successfully');
    } catch (error) {
        console.error('Reorder hero sliders error:', error);
        return errorResponse(res, 'Failed to reorder hero sliders', 500);
    }
};

// Get Hero Slider by ID
const getHeroSliderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) return errorResponse(res, 'Invalid ID format', 400);

        const heroSlider = await prisma.heroSlider.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        id: true,
                        slug: true,
                        productName: true,
                        price: true,
                        regularPrice: true,
                        discountType: true,
                        discountValue: true,
                        images: true,
                        sku: true,
                        productVariants: {
                            select: {
                                id: true,
                                image: true,
                                price: true,
                                regularPrice: true,
                                attributes: true
                            }
                        }
                    }
                }
            }
        });

        if (!heroSlider) return errorResponse(res, 'Hero slider not found', 404);

        return successResponse(res, 'Hero slider retrieved successfully', heroSlider);
    } catch (error) {
        console.error('Get hero slider by ID error:', error);
        return errorResponse(res, 'Failed to retrieve hero slider', 500);
    }
};

// Update Hero Slider
const updateHeroSlider = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) return errorResponse(res, 'Invalid ID format', 400);

        const { sub_title, title, image, link, badge, categoryLink, productId } = req.body;

        // Check if hero slider exists
        const existingHeroSlider = await prisma.heroSlider.findUnique({
            where: { id }
        });

        if (!existingHeroSlider) return errorResponse(res, 'Hero slider not found', 404);

        const updatedHeroSlider = await prisma.heroSlider.update({
            where: { id },
            data: {
                sub_title: sub_title !== undefined ? sub_title : existingHeroSlider.sub_title,
                title: title !== undefined ? title : existingHeroSlider.title,
                image: image !== undefined ? image : existingHeroSlider.image,
                link: link !== undefined ? link : existingHeroSlider.link,
                badge: badge !== undefined ? badge : existingHeroSlider.badge,
                categoryLink: categoryLink !== undefined ? categoryLink : existingHeroSlider.categoryLink,
                productId: productId !== undefined ? (productId ? parseInt(productId) : null) : existingHeroSlider.productId
            },
            include: {
                product: {
                    select: {
                        id: true,
                        slug: true,
                        productName: true,
                        price: true,
                        regularPrice: true,
                        discountType: true,
                        discountValue: true,
                        images: true,
                        sku: true,
                        productVariants: {
                            select: {
                                id: true,
                                image: true,
                                price: true,
                                regularPrice: true,
                                attributes: true
                            }
                        }
                    }
                }
            }
        });

        return successResponse(res, 'Hero slider updated successfully', updatedHeroSlider);
    } catch (error) {
        console.error('Update hero slider error:', error);
        
        if (error.code === 'P2025') {
            return errorResponse(res, 'Hero slider not found', 404);
        }
        
        return errorResponse(res, 'Failed to update hero slider', 500);
    }
};

// Delete Hero Slider
const deleteHeroSlider = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) return errorResponse(res, 'Invalid ID format', 400);

        // Check if hero slider exists
        const existingHeroSlider = await prisma.heroSlider.findUnique({
            where: { id }
        });

        if (!existingHeroSlider) return errorResponse(res, 'Hero slider not found', 404);

        await prisma.heroSlider.delete({
            where: { id }
        });

        return successResponse(res, 'Hero slider deleted successfully');
    } catch (error) {
        console.error('Delete hero slider error:', error);
        
        if (error.code === 'P2025') {
            return errorResponse(res, 'Hero slider not found', 404);
        }
        
        return errorResponse(res, 'Failed to delete hero slider', 500);
    }
};

module.exports = {
    createHeroSlider,
    getAllHeroSliders,
    getHeroSliderById,
    updateHeroSlider,
    deleteHeroSlider,
    reorderHeroSliders
};