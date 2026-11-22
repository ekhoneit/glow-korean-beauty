// src/controllers/bentoImageCard.controller.js
const prisma = require('../utils/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create BentoImageCard
const createBentoImageCard = async (req, res) => {
    try {
        const { title, sub_title, image, link, category, priority } = req.body;

        // Auto assign priority to end if not specified
        let cardPriority = priority !== undefined ? parseInt(priority) : null;
        if (cardPriority === null || isNaN(cardPriority)) {
            const maxPriorityCard = await prisma.bentoImageCard.findFirst({
                orderBy: { priority: 'desc' }
            });
            cardPriority = maxPriorityCard ? maxPriorityCard.priority + 1 : 1;
        }

        const newCard = await prisma.bentoImageCard.create({
            data: {
                title: title || '',
                sub_title: sub_title || '',
                image: image || '',
                link: link || '',
                category: category || '',
                priority: cardPriority
            }
        });

        return successResponse(res, 'Bento image card created successfully', newCard, 201);
    } catch (error) {
        console.error('Create bento image card error:', error);
        return errorResponse(res, 'Failed to create bento image card', 500);
    }
};

// Get All BentoImageCards (sorted by priority asc, then createdAt asc)
const getAllBentoImageCards = async (req, res) => {
    try {
        const cardData = await prisma.bentoImageCard.findMany({
            orderBy: [
                { priority: 'asc' },
                { createdAt: 'asc' }
            ]
        });

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

        await prisma.$transaction(
            orderedIds.map((id, index) =>
                prisma.bentoImageCard.update({
                    where: { id: parseInt(id) },
                    data: { priority: index + 1 }
                })
            )
        );

        const updatedCards = await prisma.bentoImageCard.findMany({
            orderBy: [
                { priority: 'asc' },
                { createdAt: 'asc' }
            ]
        });

        return successResponse(res, 'Bento cards reordered successfully', updatedCards);
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

        const updatedCard = await prisma.bentoImageCard.update({
            where: { id },
            data: {
                title: title !== undefined ? title : existingCard.title,
                sub_title: sub_title !== undefined ? sub_title : existingCard.sub_title,
                image: image !== undefined ? image : existingCard.image,
                link: link !== undefined ? link : existingCard.link,
                category: category !== undefined ? category : existingCard.category,
                priority: priority !== undefined ? parseInt(priority) : existingCard.priority
            }
        });

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
