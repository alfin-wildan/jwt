const express = require('express')
const router = express.Router()
const {
    getAuthors,
    getAuthor,
    addAuthor,
    updateAuthor,
    deleteAuthor
} = require('../controllers/AuthorController')

//untuk menampilkan data
router.get('/',getAuthors)

//untuk mengirim data 
router.post('/', addAuthor)

//untuk menampilkan data sesuai id buku
router.get('/:id', getAuthor)

// unruk memperbarui/update data
router.put('/:id', updateAuthor)

//untuk menghapus data
router.delete('/:id', deleteAuthor)

module.exports = router