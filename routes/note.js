const express = require('express');

const noteController = require('../controllers/note');

const router = express.Router();
const isAuth = require('../middleware/is-auth.js');

// POST /create a note
router.post('/', isAuth, noteController.createNote);

// GET /all notes
router.get('/', isAuth, noteController.sortAllNotes);

//GET /filter by category
router.get('/category/:catId', isAuth, noteController.filterByCategory);

//GET /search by tag
router.get('/tag/:key', noteController.searchByTag);

// PUT /update note
router.put('/', isAuth, noteController.updateNote);

// DELTE /delete note
router.delete('/', isAuth, noteController.deleteNote);

module.exports = router;