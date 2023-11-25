const express = require("express")
const router = express.Router()

const {createUser, login, updateUser, deleteUser, removeUser} = require('../controllers/userController')
const {addBook, updateBook, removeBook, viewBooks, viewBookById, borrowBook, returnBook} = require('../controllers/bookController')
const {authentication, authorization, librarianAuthorization} = require('../middlewares/auth')

router.post('/createUser', createUser)
router.post('/login', login)
router.put('/updateUser/:userId', authentication, authorization, updateUser)
router.delete('/deleteUser/:userId', authentication, authorization, deleteUser)
router.delete('/user/:userId/removeUserFromSystem/:bookId/:removeUserId', authentication, authorization, librarianAuthorization, removeUser)

router.post('/addBook/:userId', authentication, librarianAuthorization, addBook)
router.put('/user/:userId/updateBook/:bookId', authentication, authorization, librarianAuthorization, updateBook)
router.delete('/user/:userId/removeBook/:bookId', authentication, authorization, librarianAuthorization, removeBook)
router.get('/viewBooks', authentication, viewBooks)
router.get('/viewBookById/:bookId', authentication, viewBookById)
router.put('/borrowBook/:bookId', authentication, borrowBook)
router.put('/returnBook/:bookId', authentication, returnBook)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router