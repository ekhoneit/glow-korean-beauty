// src/controllers/bentoImageCard.controller.js
const prisma = require('../utils/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create BentoImageCard
const createBentoImageCard = async (req, res) => {
    try {
        const { title, sub_title, image, link, category, priority } = req.body;

        const data = {
            title: title || '',
            sub_title: sub_title || '',
            image: image || '',
            link: link || '',
            category: category || ''
        };

        // Gracefully set priority if schema/DB supports it
        try {
            let cardPriority = priority !== undefined ? parseInt(priority) : null;
            if (cardPriority === null || isNaN(cardPriority)) {
                const maxPriorityCard = await prisma.bentoImageCard.findFirst({
                    orderBy: { priority: 'desc' }
                });
                cardPriority = maxPriorityCard ? (maxPriorityCard.priority || 0) + 1 : 1;
            }
            data.priority = cardPriority;
        } catch (_) {
            // Priority not supported yet in Prisma client, ignore
        }

        let newCard;
        try {
            newCard = await prisma.bentoImageCard.create({ data });
        } catch (err) {
            // Fallback if priority argument fails
            delete data.priority;
            newCard = await prisma.bentoImageCard.create({ data });
        }

        return successResponse(res, 'Bento image card created successfully', newCard, 201);
    } catch (error) {
        console.error('Create bento image card error:', error);
        return errorResponse(res, 'Failed to create bento image card', 500);
    }
};

// Get All BentoImageCards (graceful sorting)
const getAllBentoImageCards = async (req, res) => {
    try {
        let cardData;
        try {
            // Try sorting by priority asc, then createdAt asc
            cardData = await prisma.bentoImageCard.findMany({
                orderBy: [
                    { priority: 'asc' },
                    { createdAt: 'asc' }
                ]
            });
        } catch (prismaErr) {
            // Fallback if server hasn't generated prisma client with priority yet
            cardData = await prisma.bentoImageCard.findMany({
                orderBy: { createdAt: 'desc' }
            });
            // Sort in JS if priority exists on objects
            cardData.sort((a, b) => {
                if (a.priority !== undefined && b.priority !== undefined) {
                    return a.priority - b.priority;
                }
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
        }

        return successResponse(res, cardData);
    } catch (error) {
        console.error('Get all bento image cards error:', error);
        return errorResponse(res, 'Failed to retrieve bento image cards', 500);
    }
};

// Reorder Bento Cards
const reorderBentoImageCards = async (req, res) => {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return errorResponse(res, 'orderedIds must be a non-empty array of card IDs', 400);
        }

        try {
            await prisma.$transaction(
                orderedIds.map((id, index) =>
                    prisma.bentoImageCard.update({
                        where: { id: parseInt(id) },
                        data: { priority: index + 1 }
                    })
                )
            );
        } catch (reorderErr) {
            console.warn('Prisma transaction update failed, fallback to raw SQL:', reorderErr.message);
            // If prisma client doesn't know priority yet, use raw SQL
            for (let i = 0; i < orderedIds.length; i++) {
                const cardId = parseInt(orderedIds[i]);
                await prisma.$executeRawUnsafe(
                    `UPDATE BentoImageCard SET priority = ? WHERE id = ?`,
                    i + 1,
                    cardId
                ).catch((err) => {
                    console.error(`Failed to update priority for card ${cardId}:`, err.message);
                });
            }
        }

        return successResponse(res, 'Bento cards reordered successfully');
    } catch (error) {
        console.error('Reorder bento image cards error:', error);
        return errorResponse(res, 'Failed to reorder bento cards', 500);
    }
};

// Get BentoImageCard by ID
const getBentoImageCardById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) return errorResponse(res, 'Invalid ID format', 400);

        const card = await prisma.bentoImageCard.findUnique({
            where: { id }
        });

        if (!card) return errorResponse(res, 'Bento image card not found', 404);

        return successResponse(res, card);
    } catch (error) {
        console.error('Get bento image card by ID error:', error);
        return errorResponse(res, 'Failed to retrieve bento image card', 500);
    }
};

// Update BentoImageCard
const updateBentoImageCard = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) return errorResponse(res, 'Invalid ID format', 400);

        const { title, sub_title, image, link, category, priority } = req.body;

        const existingCard = await prisma.bentoImageCard.findUnique({
            where: { id }
        });

        if (!existingCard) return errorResponse(res, 'Bento image card not found', 404);

        const data = {
            title: title !== undefined ? title : existingCard.title,
            sub_title: sub_title !== undefined ? sub_title : existingCard.sub_title,
            image: image !== undefined ? image : existingCard.image,
            link: link !== undefined ? link : existingCard.link,
            category: category !== undefined ? category : existingCard.category
        };

        if (priority !== undefined) {
            data.priority = parseInt(priority);
        }

        let updatedCard;
        try {
            updatedCard = await prisma.bentoImageCard.update({
                where: { id },
                data
            });
        } catch (err) {
            delete data.priority;
            updatedCard = await prisma.bentoImageCard.update({
                where: { id },
                data
            });
        }

        return successResponse(res, 'Bento image card updated successfully', updatedCard);
    } catch (error) {
        console.error('Update bento image card error:', error);
        
        if (error.code === 'P2025') {
            return errorResponse(res, 'Bento image card not found', 404);
        }
        
        return errorResponse(res, 'Failed to update bento image card', 500);
    }
};

// Delete BentoImageCard
const deleteBentoImageCard = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) return errorResponse(res, 'Invalid ID format', 400);

        const existingCard = await prisma.bentoImageCard.findUnique({
            where: { id }
        });

        if (!existingCard) return errorResponse(res, 'Bento image card not found', 404);

        await prisma.bentoImageCard.delete({
            where: { id }
        });

        return successResponse(res, 'Bento image card deleted successfully');
    } catch (error) {
        console.error('Delete bento image card error:', error);
        
        if (error.code === 'P2025') {
            return errorResponse(res, 'Bento image card not found', 404);
        }
        
        return errorResponse(res, 'Failed to delete bento image card', 500);
    }
};

module.exports = {
    createBentoImageCard,
    getAllBentoImageCards,
    reorderBentoImageCards,
    getBentoImageCardById,
    updateBentoImageCard,
    deleteBentoImageCard
};
