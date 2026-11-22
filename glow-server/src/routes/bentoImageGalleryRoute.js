const express = require('express');
const {
    getAllBentoImageCards,
    getBentoImageCardById,
    createBentoImageCard,
    updateBentoImageCard,
    reorderBentoImageCards,
    deleteBentoImageCard } = require('../controllers/bentoImageGalleryController');
const router = express.Router();

router.get('/', getAllBentoImageCards);
router.put('/reorder', reorderBentoImageCards);
router.get('/:id', getBentoImageCardById);
router.post('/', createBentoImageCard);
router.patch('/:id', updateBentoImageCard);
router.delete('/:id', deleteBentoImageCard);

module.exports = router;
