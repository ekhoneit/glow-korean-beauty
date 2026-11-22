// src/routes/hero-slider.routes.js
const express = require('express');
const {
    getAllHeroSliders,
    getHeroSliderById,
    createHeroSlider,
    updateHeroSlider,
    deleteHeroSlider,
    reorderHeroSliders
} = require('../controllers/heroSliderController');
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();



router.get('/', getAllHeroSliders);
router.put('/reorder', reorderHeroSliders);
router.get('/:id', getHeroSliderById);
router.post('/', createHeroSlider);
router.patch('/:id', updateHeroSlider);
router.delete('/:id', deleteHeroSlider);

module.exports = router;
