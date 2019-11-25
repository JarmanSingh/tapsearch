const express = require('express');
const router = express.Router();

const docs = require('../controllers/home');

router.get('/index', docs.index_get);
router.post('/index', docs.index_post);
router.get('/search', docs.search_get);
router.post('/search', docs.search_post);
router.get('/clear', docs.clear_get);

module.exports = router;